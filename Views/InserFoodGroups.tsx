import { Box,ScrollView,Heading,Card, VStack, Text, Button, ButtonText, FormControl, FormControlLabel, Input, InputField, FormControlLabelText } from '@gluestack-ui/themed';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ApiUrl } from './API/Config';
import { useFocusEffect } from '@react-navigation/native';
const InserFoodGroups = () => {
    const [formData, setData] = useState({});
    const [groupData, setGroupData] = useState<any[]>([]);

    useFocusEffect(
        useCallback(()=>{
            const data = async()=>{
                try {
                    const response = await axios.get(`${ApiUrl}FoodGroupIndex`);
                    setGroupData(response.data);               
                } catch (error) {
                    console.log("error getting the groups", error);
                }
            };
            data();

        }, [])
    );

    

    const onSubmit = async () => {
        try {
            axios.post(`${ApiUrl}FoodGroupStore`, formData);
            const response = await axios.get(`${ApiUrl}FoodGroupIndex`);
            setGroupData(response.data); 

        } catch (arror) {
            console.log("error", arror);
        }

    }
    const onDelete = async(id:string)=>{
        try {
            axios.post(`${ApiUrl}FoodGroupDestroy/${id}`);
            const response = await axios.get(`${ApiUrl}FoodGroupIndex`);
            setGroupData(response.data); 
            console.log("deleted");
            
        } catch (error) {
            console.log("not deleted");
        }
    }
    return (

        <Box height={"$full"} width={"$full"}>
            <VStack >
                <Text marginTop={"$10"} textAlign='center'>Create a Category </Text>
                <FormControl size={"md"} isDisabled={false} isRequired={false}>


                    <Input>
                        <InputField placeholder='Name' defaultValue='' type='text' onChangeText={value => setData({
                            ...formData,
                            Name: value
                        })} />
                    </Input>

                </FormControl>

            </VStack>
            <Button onPress={onSubmit} action={"primary"} backgroundColor={"#FFA600"} mt={"$5"} size={"lg"} mx={"$auto"} width={"$full"} borderRadius={"$lg"} mt={"$2"} isDisabled={false} sx={{
                ':hover': {
                    backgroundColor: '#c4871d'
                }
            }}>
                <ButtonText>
                    Add
                </ButtonText>

            </Button>

            
            <ScrollView width={"$full"} height={"$full"}  p={4} overflow='auto'>
                {groupData.map((group, index) => (
                    <Card key={index} size="md" variant="filled" m="$3">
                        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
                            <Box>
                                <Heading mb="$1" size="md">
                                    {group.Name}
                                </Heading>
                                
                            </Box>

                            <Button onPress={()=>onDelete(group.id)} size="xs" backgroundColor='red' width={"$35px"} variant="solid"  isDisabled={false} isFocusVisible={false} >
                                <ButtonText>x</ButtonText>
                            </Button>
                        </Box>
                    </Card>
                ))}
            </ScrollView>
        </Box>
    );



}
export default InserFoodGroups;