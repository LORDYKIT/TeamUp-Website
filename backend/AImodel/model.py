import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from imblearn.over_sampling import RandomOverSampler
import joblib

class HateSpeechModel:
    def __init__(self):
        self.vectorizer = TfidfVectorizer()
        self.model = LogisticRegression()

    def load_data(self, csv_file):
        data = pd.read_csv(csv_file)
        X = data['Text']
        y = data['oh_label']
        return X, y

    def preprocess(self, X, y):
        X_vectors = self.vectorizer.fit_transform(X)
        oversampler = RandomOverSampler(random_state=42)
        X_resampled, y_resampled = oversampler.fit_resample(X_vectors, y)
        return X_resampled, y_resampled

    def train(self, X, y):
        X_resampled, y_resampled = self.preprocess(X, y)
        self.model.fit(X_resampled, y_resampled)

    def predict(self, text):
        text_vector = self.vectorizer.transform([text])
        prediction = self.model.predict(text_vector)
        return "Hateful" if prediction[0] == 1 else "Not Hateful"

    def save_model(self, model_file, vectorizer_file):
        joblib.dump(self.model, model_file)
        joblib.dump(self.vectorizer, vectorizer_file)

    def load_model(self, model_file, vectorizer_file):
        self.model = joblib.load(model_file)
        self.vectorizer = joblib.load(vectorizer_file)

# If you choose to separate model training and prediction, you can call this class in app.py.
