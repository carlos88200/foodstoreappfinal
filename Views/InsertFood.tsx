import { Box, Heading, ModalBody, ModalFooter, Center, Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, Icon, CloseIcon, Card, VStack, Text, Button, ButtonText, FormControl, FormControlLabel, Input, InputField, FormControlLabelText } from '@gluestack-ui/themed';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Image, View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ApiUrl } from './API/Config';
import { Picker } from '@react-native-picker/picker';

const InsertFood = () => {
    const [formData, setData] = useState({});
    const [foodData, setFoodData] = useState<any[]>([]);
    const [groupData, setGroupData] = useState<any[]>([]);
    const [image, setImage] = useState(null);
    const [showModal, setShowModal] = useState(false)
    console.log(showModal)
    const ref = React.useRef(null)



    useEffect(() => {
        const data = async () => {
            try {
                const response = await axios.get(`${ApiUrl}foodIndex`);
                setFoodData(response.data);
            } catch (error) {
                console.log("error getting the groups", error);
            }
        };
        const dataGroup = async () => {
            try {
                const response = await axios.get(`${ApiUrl}FoodGroupIndex`);
                setGroupData(response.data);
            } catch (error) {
                console.log("error getting the groups", error);
            }
        };
        data();
        dataGroup();
    }, []);


    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };
    const onSubmit = async () => {
        try {
            const responsee = await fetch(image);
            const blob = await responsee.blob();


            console.log("name", formData.Name, "yyyy00", formData);
            let formDta = new FormData();
            formDta.append('Name', formData.Name);
            formDta.append('Description', formData.Description);
            formDta.append('Price', formData.Price);
            formDta.append('idFoodGroupFK', formData.idFoodGroupFK);
            formDta.append('Image', blob, 'filename.jpg');

            const response = await axios({
                method: 'POST',
                url: `${ApiUrl}foodStore`,
                data: formDta,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log("add", response.data);
            try {
                const response = await axios.get(`${ApiUrl}foodIndex`);
                setFoodData(response.data);
                console.log("new", response.data);
            } catch (error) {
                console.log("error getting the groups", error);
            }
            setShowModal(false);



        } catch (error) {
            console.log("error", error);
        }
    }

    const onDelete = async (id: string) => {
        try {
            axios.post(`${ApiUrl}FoodDestroy/${id}`);
            setShowModal(false);
            const response = await axios.get(`${ApiUrl}foodIndex`);
            setFoodData(response.data);
            console.log("deleted");

        } catch (error) {
            console.log("not deleted");
        }
    }
    return (
        <Box height={"$full"} width={"$full"}>

            <Box alignContent='left' margin={"$10px"}>
                <Button width={"$25%"} onPress={() => setShowModal(true)} ref={ref}>
                    <ButtonText>Add</ButtonText>
                </Button>
                <Modal
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false)
                    }}
                    finalFocusRef={ref}
                >
                    <ModalBackdrop />
                    <ModalContent>
                        <ModalHeader>
                            <Heading size="lg">Food</Heading>
                            <ModalCloseButton>
                                <Icon as={CloseIcon} />
                            </ModalCloseButton>
                        </ModalHeader>
                        <ModalBody>
                            <FormControl size={"md"} isDisabled={false} isRequired={false}>
                                <Text>Name</Text>

                                <Input>
                                    <InputField placeholder='Name' defaultValue='' type='text' onChangeText={value => setData({
                                        ...formData,
                                        Name: value
                                    })} />
                                </Input>

                            </FormControl>
                            <FormControl size={"md"} isDisabled={false} isRequired={false}>
                                <Text>Description</Text>
                                <Input>
                                    <InputField placeholder='Description' defaultValue='' type='text' onChangeText={value => setData({
                                        ...formData,
                                        Description: value
                                    })} />
                                </Input>

                            </FormControl>
                            <FormControl size={"md"} isDisabled={false} isRequired={false}>
                                <Text>Price</Text>


                                <Input>
                                    <InputField placeholder='Price' defaultValue='' type='number' onChangeText={value => setData({
                                        ...formData,
                                        Price: value
                                    })} />
                                </Input>

                            </FormControl>
                            <FormControl size={"md"} isDisabled={false} isRequired={false}>
                                <Text>Category</Text>

                                <Picker
                                    selectedValue={formData.idFoodGroupFK}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setData({ ...formData, idFoodGroupFK: itemValue })
                                    }>
                                    <Picker.Item label="Choosee..." value="" />
                                    {groupData.map((group, index) => (
                                        <Picker.Item key={index} label={group.Name} value={group.id} />
                                    ))}
                                </Picker>

                            </FormControl>

                            <FormControl size={"md"} isDisabled={false} isRequired={false}>
                                <Text>Image</Text>
                                <Button title="Image" onPress={pickImage} />
                            </FormControl>

                        </ModalBody>
                        <ModalFooter>
                            <Button
                                variant="outline"
                                size="sm"
                                action="secondary"
                                mr="$3"
                                onPress={() => {
                                    setShowModal(false)
                                }}
                            >
                                <ButtonText>Cancel</ButtonText>
                            </Button>
                            <Button
                                size="sm"
                                action="positive"
                                borderWidth="$0"
                                onPress={onSubmit}
                            >
                                <ButtonText>add</ButtonText>
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box>


            <Box width={"$full"} height={"$full"} flex="1" p={4} overflow='auto'>
                {foodData.map((food, index) => (
                    <Card key={index} size="md" variant="filled" m="$3">
                        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
                            <Box>
                                <Heading mb="$1" size="md">
                                    {food.Name}
                                </Heading>

                            </Box>

                            <Button onPress={() => onDelete(food.id)} size="xs" backgroundColor='red' width={"$35px"} variant="solid" isDisabled={false} isFocusVisible={false} >
                                <ButtonText>x</ButtonText>
                            </Button>
                        </Box>
                    </Card>
                ))}
            </Box>
        </Box>

    );
}
export default InsertFood;