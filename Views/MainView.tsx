import React, { useState, useEffect, useCallback } from 'react';
import { Box, Card, Heading, Image, Text, ScrollView, VStack, Button, ButtonText, Icon } from '@gluestack-ui/themed';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getFoodItems } from './API/Request';
import { FoodResponse, Img } from './API/Config';

const MainView = () => {

    const navigation = useNavigation();

    /* LLamada a la API*/
    const [FoodItems, SetFoodItems] = useState<FoodResponse[]>([]);

    const food = async () => {
        const data = await getFoodItems();
        if (data != null) {
            SetFoodItems(data);
        }
    }
    useFocusEffect(
        useCallback(()=>{
            food();
        },[])
    );

    

    useEffect(() => {
        if (FoodItems !== undefined) {
            console.log("que tiene foodItems", FoodItems);
        }
    }, [FoodItems]);
    /* Finaliza llamada a la API  */


    return <Box mt={"$5"} padding={"$5"} height={"$full"}>
        <Text ml={"$2"} fontWeight='$bold' fontSize={"$xl"} color='black'>Hungry Chilaquiles Killer</Text>

        <Image size="md" width={"$full"} height={"$1/2"} alt="login_image" source={require("../assets/chilaquiles.jpeg")} resizeMode="cover" style={{
            alignSelf: "center"
        }} />

        <ScrollView height={"$full"}>
            <VStack>
                {FoodItems && FoodItems.slice(0, 3).map((item, index) => (
                    <Card key={index} size="md" variant="elevated" m="$3">
                        <Image
                            mb="$6"
                            h={120}
                            width="$full"
                            borderRadius="$md"
                            source={{
                                uri: `${Img + item.Image}`,
                            }}
                        />
                        <Heading mb="$1" size="md">
                            {item.Name}
                        </Heading>
                        <Text size="sm">{item.Description}</Text>
                        <Text size="sm">Precio: {item.Price}</Text>

                        <Button action={"primary"} onPress={() => navigation.navigate('Details', { Id: item.id })}
                            backgroundColor={"#FFA600"} size={"lg"} width={"$full"} borderRadius={"$lg"} mt={"$2"}>
                            <ButtonText>
                                See product
                            </ButtonText>
                            <Icon name="arrow-forward" color="#000000" />
                        </Button>
                    </Card>
                ))}
            </VStack>

        </ScrollView>
    </Box>;
};

export default MainView