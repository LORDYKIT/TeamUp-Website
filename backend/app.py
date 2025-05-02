from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from imblearn.over_sampling import RandomOverSampler



# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS to allow frontend requests

# Load the model and vectorizer
def load_model():
    # Load your dataset
    data = pd.read_csv('AImodel/aggressionCleaned.csv')
    
    # Preprocess data
    X = data['Text']
    y = data['oh_label']
    
    # Feature extraction
    vectorizer = TfidfVectorizer()
    X_vectors = vectorizer.fit_transform(X)

    # Resampling
    oversampler = RandomOverSampler(random_state=42)
    X_resampled, y_resampled = oversampler.fit_resample(X_vectors, y)

    # Train the model
    model = LogisticRegression()
    model.fit(X_resampled, y_resampled)

    return model, vectorizer

# Load the model and vectorizer when the app starts
model, vectorizer = load_model()

@app.route('/predict', methods=['POST'])
def predict():
    text = request.json.get('text')  # Get text input from the request
    if not text:
        return jsonify({"error": "No text provided"}), 400  # Bad request if no text
    
    try:
        text_vector = vectorizer.transform([text])  # Transform the text input
        prediction = model.predict(text_vector)  # Make prediction
        return jsonify({"prediction": "Hateful" if prediction[0] == 1 else "Not Hateful"})
    except Exception as e:
        print("Error during prediction:", e)
        return jsonify({"error": "Failed to process text"}), 500  # Internal server error

if __name__ == '__main__':
    app.run(debug=True)
