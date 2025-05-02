
import { Flex } from "@chakra-ui/react"
import WelcomeHeader from "../components/WelcomeHeader"
import Hero from "../components/Hero" // will add this in the part 2

function WelcomePage(props) {
  return (
    <>
      <WelcomeHeader /> 
    <Flex
      direction="column"
      align="center"
      maxW={{ xl: "1000px" }}
      m="0 auto"
      {...props}
    >
      
      {props.children}
      <Hero />
    </Flex>
    </>
  )
}

export default WelcomePage;