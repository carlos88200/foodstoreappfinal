import { AvatarImage, Heading, Box, Text, Button, Avatar, ScrollView, VStack, Card, ButtonText } from "@gluestack-ui/themed";
import { useState, useCallback } from "react";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage'; //async
import { useFocusEffect } from '@react-navigation/native';
import { ApiUrl, Img } from '../API/Config';

const ShoppingHistory = () => {
    let tokenString;
    let token;
    const [productData, setProductData] = useState<any[]>([]);
    useFocusEffect(
        useCallback(() => {
            const fetchUserData = async () => {
                tokenString = await AsyncStorage.getItem('token');
                token = JSON.parse(tokenString);
                let idUser;
                let FavoriteUser = [];
                let FavoriteEndarr = [];

                if (token) {
                    try {
                        const response = await axios.get(`${ApiUrl}Userauth`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        //setUserData(response.data);
                        idUser = response.data.id;
                    } catch (error) {
                        console.log(" we cannot get the information ", error);
                    }
                }

                try {
                    const response = await axios.get(`${ApiUrl}ShoppingIndex/${idUser}`);
                    setProductData(response.data);
                } catch (error) {
                    console.log(" we cannot get the information fav ", error);
                }
            };

            fetchUserData();
        }, [])
    );

    return (
        <Box py="$10">
            <ScrollView>
                <VStack marginTop={"$3px"} backgroundColor='white' height={"$full"} width={"$full"} >
                    {productData.map((shopping, index) => (
                        <Card key={index} size="md" variant="elevated" m="$3" display={"$flex"}>
                            <VStack  maxWidth={"$12"}>
                                <Avatar size="md">
                                    <AvatarImage source={{ uri: Img + shopping.food.Image }} />
                                </Avatar>
                            </VStack>
                            <VStack  position="relative"  >
                                <Text size="lg">
                                    {shopping.food.Name}
                                </Text>
                            </VStack>
                            <VStack alignItems="flex-end" >                  
                                <Text bold size="lg" backgroundColor="white">
                                    {shopping.food.Price}.00 $
                                </Text>

                            </VStack>

                        </Card>
                    ))}
                </VStack>
            </ScrollView>
        </Box>
    );

}
export default ShoppingHistory;