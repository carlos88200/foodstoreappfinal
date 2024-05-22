import { Box, Text, Button,Avatar,AvatarFallbackText, ButtonText } from "@gluestack-ui/themed";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage'//async
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { ApiUrl } from '../Views/API/Config';
//import ShoppingHistory from "../Views/Components/ShoppingHistory";

const Account = () => {
    const [userData, setUserData] = useState({});
    let tokenString;
    let token;
    const navigation = useNavigation();

    useEffect(() => {
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
        };

        fetchUserData();
    }, []);
    const onSubmit = async () => {
        await AsyncStorage.removeItem('token');
        navigation.navigate('Principal');

    }
    

    return (
        <Box backgroundColor='white' alignItems="center" mt={10} display="flex" flexDirection="column" height={"$full"} >

            <Box  height={'30%'} width={'100%'} backgroundColor='#FFA600' p={4} display='inline-block'>
                <Avatar bgColor='black' size="xl" marginLeft={"$10"} marginTop={"$10"}>
                    <AvatarFallbackText>{userData.Name}</AvatarFallbackText>
                </Avatar>
                <Text position='absolute' left={"33%"} color='white' fontSize={"$2xl"} marginTop={"$12"} >Hi, {userData.Name}</Text>
            </Box>
            <Box width={"$full"}  p={4} >
                <Text color='black' fontSize={"$2xl"}>Name: {userData.Name}</Text>
                <Text color='black' fontSize={"$2xl"}>FirstSurname:{userData.FirstSurname}</Text>
                <Text color='black' fontSize={"$2xl"}>SecondSurname:{userData.SecondSurname}</Text>
                <Text color='black' fontSize={"$2xl"}>PhoneNumber: {userData.PhoneNumber}</Text>
                <Text color='black' fontSize={"$2xl"}>Email: {userData.Email}</Text>
            </Box>
            <Button onPress={() => navigation.navigate('ShoppingHistory')} action='primary' marginBottom={"$2"} width={"$3/4"} backgroundColor='#FFA600' color='white' top={"60%"} p={2}>
                <ButtonText>
                     Shopping history
                </ButtonText>
            </Button>
            <Button onPress={onSubmit} action='primary' width={"$3/4"} backgroundColor='#FFA600' color='white' top={"60%"} p={2}>
                <ButtonText>
                    LogOut
                </ButtonText>
            </Button>
        </Box>
    );

}
export default Account;