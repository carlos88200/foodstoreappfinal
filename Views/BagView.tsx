import { Box, Image, Divider, VStack, ScrollView, Button, ButtonText, View, Text, AvatarFallbackText, Avatar, Card, Heading } from '@gluestack-ui/themed';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'//async
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { ButtonIcon, ButtonSpinner, ButtonGroup } from '@gluestack-ui/themed';
import { Icon } from '@gluestack-ui/themed';
import { CloseIcon } from '@gluestack-ui/themed';
import { ApiUrl, Img } from './API/Config';

const Bagview = () => {
    const navigation = useNavigation();
    // const token = await AsyncStorage.getItem('token');
    //console.log("token en bag", token);

    const [userData, setUserData] = useState({});
    const [carData, setCarData] = useState<any[]>([]);
    const [productData, setProductData] = useState({});
    const [carFullData, setCarFullData] = useState({});
    const [productfinData, setProductfinData] = useState({});
    const [totalData, setTotalData] = useState(0);
    const [carEnd, setCarEnd] = useState<any[]>([]);
    const datos: any[] = [];
    const datosfinal: any[] = [];
    let tokenString;
    let token;
    let total = 0;

    useFocusEffect(
        useCallback(() => {
            const fetchUserData = async () => {
                tokenString = await AsyncStorage.getItem('token');
                token = JSON.parse(tokenString);
                let idUser;
                let carUser = [];
                let caarEnd = [];
                let total = 0;

                if (token) {
                    try {
                        const response = await axios.get(`${ApiUrl}Userauth`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        setUserData(response.data);
                        idUser = response.data.id;
                    } catch (error) {
                        console.log(" we cannot get the information ", error);
                    }
                }
                try {
                    const response = await axios.get(`${ApiUrl}carr/${idUser}`);
                    setCarData(response.data);
                    console.log("inf",response.data);
                    response.data.forEach(element => {
                        total += element.food.Price;
                    });
                    setTotalData(total);
                } catch (error) {
                    console.log(" we cannot get the information car", error);
                }
            };
            fetchUserData();
        }, [])
    );

    const onDelete = async (id: string) => {
        tokenString = await AsyncStorage.getItem('token');
        token = JSON.parse(tokenString);
        let idUser;
        let carUser = [];
        let caarEnd = [];
        if (token) {
            try {
                console.log("id", id);
                const response = await axios.post(`${ApiUrl}CarDestroy/${id}`);
                console.log("deleted");
            } catch (error) {
                console.log("not deleted", error);
            }
            try {
                const response = await axios.get(`${ApiUrl}Userauth`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUserData(response.data);
                idUser = response.data.id;
            } catch (error) {
                console.log(" we cannot get the information ", error);
            }
            try {
                const response = await axios.get(`${ApiUrl}carr/${idUser}`);
                setCarData(response.data);
                console.log("dat",response.data);
                response.data.forEach(element => {
                    total += element.food.Price;
                });
                setTotalData(total);
            } catch (error) {
                console.log(" we cannot get the information car", error);
            }
        }
    }

    const onSubmit = async() => {
        for(let dato of carData){
            //console.log("data", dato);
           
            try{
                const response = await axios.post(`${ApiUrl}ShoppingStore`,{
                    Quantity: '1',
                    IdUserFK: dato.IdUserFK,
                    IdFoodFK: dato.IdFoodFK
                });
                console.log("added");

            }catch(error){
                console.log("we couldn't add them");
                
            }
            
            try {
                
                const response = await axios.post(`${ApiUrl}destroycar/${dato.id}`);
                console.log("deleted", dato.id);
            } catch (error) {
                console.log("we couldn't delete them", error);
            }
            tokenString = await AsyncStorage.getItem('token');
        token = JSON.parse(tokenString);
        let idUser;
        let carUser = [];
        let caarEnd = [];
        if (token) {
            try {
                console.log("id", id);
                const response = await axios.post(`${ApiUrl}CarDestroy/${id}`);
                console.log("deleted");
            } catch (error) {
                console.log("not deleted", error);
            }
            try {
                const response = await axios.get(`${ApiUrl}Userauth`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUserData(response.data);
                idUser = response.data.id;
            } catch (error) {
                console.log(" we cannot get the information ", error);
            }
            try {
                const response = await axios.get(`${ApiUrl}carr/${idUser}`);
                setCarData(response.data);
                console.log("dat",response.data);
                response.data.forEach(element => {
                    total =0;
                });
                setTotalData(total);
            } catch (error) {
                console.log(" we cannot get the information car", error);
            }
        }
            
            
        }
    }

    return (
        <Box backgroundColor='white' alignItems="center" mt={10} display="flex" flexDirection="column" height={"$full"} >
            <Box height={'40%'} width={'100%'} backgroundColor='#FFA600' p={4}>
                <Avatar bgColor='black' size="xl" borderRadius="$full" marginLeft={"$10%"} marginTop={"$10"}>
                    <AvatarFallbackText>{userData.Name}</AvatarFallbackText>
                </Avatar>
                <Text position='absolute' marginLeft={"$35%"} color='white' fontFamily='Arial' size='2xl' marginTop={"$12%"}>{userData.Name} </Text>
                <Text position='absolute' marginLeft={"$35%"} color='white' fontFamily='Arial' size='2xl' marginTop={"$17%"}>{userData.FirstSurname}</Text>
                <Text position='absolute' marginLeft={"$35%"} color='white' fontFamily='Arial' size='2xl' marginTop={"$23%"}>{userData.SecondSurname}</Text>
                <Text position='absolute' color='white' fontFamily='Arial' size='2xl' mb="$1" marginTop={"$45%"} marginLeft={"$50%"}>
                    Total: {totalData}.00 $
                </Text>
            </Box>

            <ScrollView width={"$full"} height={"$full"}  marginBottom={"$2"}>
                <VStack alignContent='center' alignItems='center' marginTop={"$3px"} backgroundColor='white' width={"$full"} height={"$full"} >
                    {carData.map((car, index) => (
                        <Card key={index} size="md" variant="elevated" m="$3" width={"80%"} >
                            <Image
                                mb="$6"
                                h={120}
                                width={"$full"}
                                source={{
                                    uri: `${Img + car.food.Image}`,
                                }}
                            />
                            <Box flexDirection="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Heading mb="$1" size="md">
                                        {car.food.Name}
                                    </Heading>
                                    <Text size="sm">
                                        {car.food.Price}.00 $
                                    </Text>
                                </Box>

                                <Button onPress={() => onDelete(car.id)} size="xs" backgroundColor='red' width={"$35px"} variant="solid" isDisabled={false} isFocusVisible={false} >
                                    <ButtonText>x</ButtonText>
                                </Button>
                            </Box>
                        </Card>
                    ))}
                </VStack>

            </ScrollView>


            <Button onPress={onSubmit} marginBottom={"$3"} action='primary'  width={"$70%"} backgroundColor='#FFA600' color='white' p={2}>
                <ButtonText>
                    Order
                </ButtonText>
            </Button>

        </Box>
    );
}

export default Bagview;
