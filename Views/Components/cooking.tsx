import { VStack, ImageBackground,Text } from "@gluestack-ui/themed";

const cooking = () => {
    return (
        <VStack width={"$full"} height={"$full"}>
            <ImageBackground
                source={require("../assets/cooking.avif")}
                style={{ flex: 1, justifyContent: "center" }}
            >
                <Text
                    color="$white"
                    fontSize={42}
                    lineHeight={84}
                    fontWeight="$bold"
                    textAlign="center"
                    backgroundColor="#000000c0"
                >
                    your order is cooking
                </Text>
            </ImageBackground>

        </VStack>
    );

}
export default cooking;