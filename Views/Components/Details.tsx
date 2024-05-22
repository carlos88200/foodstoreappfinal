import React, { useEffect, useState } from 'react';
import { getFoodItem } from '../API/Request';
import { FoodResponse, Img } from '../API/Config';
import { AlertIcon, AlertText, InfoIcon, Box, Image, VStack, Text, Button, Alert, ButtonText } from '@gluestack-ui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage'//async
import axios from 'axios';
import { ApiUrl } from '../API/Config';


const DetailScreen = ({ route }) => {
    const [userData, setUserData] = useState({});
    const [alertMessage, setAlertMessage] = useState('');
    const [Favorite, setFavorite] = useState('');
    const [mode, setMode] = useState('Add');
    const [idUser, setidUser] = useState('');
    let tokenString;
    let token;
    let IdUs;

    const { Id } = route.params;
    const [FoodItem, SetFoodItem] = useState<FoodResponse[]>([]);

    const food = async () => {
        const data = await getFoodItem(Id);
        if (data != null) {
            SetFoodItem(data);
        }
    }

    useEffect(() => {
        food();
    }, []);

    useEffect(() => {
        if (FoodItem !== undefined) {
            console.log("que tiene FOOD Item:", FoodItem);
            console.log("url",Img,"espacio",FoodItem.Image)
        }
    }, [FoodItem]);

    const addBag = async (idUser: String, id: String) => {
        try {
            const response = await axios.post(`${ApiUrl}storecar`, {
                IdUserFK: idUser,
                IdFoodFK: id
            });
            console.log("added");
            <Alert mx='$2.5' action="info" variant="solid" >
                <AlertIcon as={InfoIcon} mr="$3" />
                <AlertText>
                    added to cart
                </AlertText>
            </Alert>
        } catch (error) {
            console.error(idUser, id, "Error adding to favorites:", error);
        }
    }

    const AddFavorite = async () => {
        try {
            const data = {
                IdUserFK: idUser,
                IdFoodFK: Id
            }
            const response = await axios({
                method: 'POST',
                url: `${ApiUrl}FavoriteStore`,
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response) {
                setMode('Added');
            }
            <Alert mx='$2.5' action="info" variant="solid" >
                <AlertText>
                    added to favorites
                </AlertText>
            </Alert>
        } catch (error) {
            console.error("Error al agregar a favoritos:", error);
        }
    }

    const deleteFavorite = async () => {
        try {
            const response = await axios({
                method: 'POST',
                url: `${ApiUrl}FavoriteDestroy/${Favorite}`,
                data: {IdUserFK:idUser},
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data) {
                setMode('Add');
            }
            <Alert mx='$2.5' action="info" variant="solid" >
                <AlertText>
                    delete from favorites
                </AlertText>
            </Alert>
        } catch (error) {

        }
    }

    useEffect(() => {
        const fetchUserData = async () => {
            tokenString = await AsyncStorage.getItem('token');
            token = JSON.parse(tokenString);
            if (token) {
                try {
                    const response = await axios.get(`${ApiUrl}Userauth`, {
                        headers: {
                            'Authorization': `Bearer ${token}` 
                        }
                    });
                    setUserData(response.data);
                    setidUser(response.data.id);
                    console.log("id user:",response.data.id);
                    IdUs = response.data.id;
                } catch (error) {
                    console.log(" we cannot get the information ", error);
                }
            }
        };

        fetchUserData();
    }, []);


    const favoriteData = async () => {
        try {
            const data = {
                IdUserFK: IdUs,
                IdFoodFK: Id
            }
            console.log("se manda", data);
            
            const favorite = await axios({
                method: 'POST',
                url: `${ApiUrl}Favorite`,
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log("holaaa imprie",favorite);
            
            if (favorite.data.id && favorite.data.id.length > 0) {
                setFavorite(favorite.data.id)
                setMode('Added');
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    useEffect(() => {
        setTimeout(() => {
            favoriteData()
        }, 1500)
    }, []);

    return (
        <Box mt={"$5"} padding={"$5"} height={"$full"} >
            <Image
                size="md"
                width={"$full"}
                height={"$1/2"}
                alt="login_image"
                source={{ uri: `${Img+FoodItem.Image}` }}
                resizeMode="cover" style={{
                    alignSelf: "center"
                }} />
            <VStack>
                <Text size="lg" fontWeight="bold">{FoodItem.Name}</Text>
                <Text size="sm">{FoodItem.Description}</Text>
                <Text size="sm" fontWeight="$extrabold">Precio: {FoodItem.Price}</Text>
            </VStack>
            <Button action='primary' onPress={() => addBag(userData.id, FoodItem.id)}>
                <ButtonText>
                    Add Bag
                </ButtonText>
            </Button>

            {mode === "Add" ? (
                <Button action='primary' my={"$5"} onPress={() => AddFavorite(userData.id, FoodItem.id)}>
                    <ButtonText>
                        Add to favorites
                    </ButtonText>
                </Button>
            ) : (
                <Button action='primary' my={"$5"} onPress={() => deleteFavorite()}>
                    <ButtonText>
                        delete favorite
                    </ButtonText>
                </Button>
            )}
        </Box>
    );
};

export default DetailScreen;