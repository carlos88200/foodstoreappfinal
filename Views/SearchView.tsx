import axios from 'axios';
import { Box, Image, VStack, ScrollView, Divider, Button, ButtonText, View, Text, AvatarFallbackText, Avatar, Card, Heading } from '@gluestack-ui/themed';
import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ApiUrl, Img } from '../Views/API/Config';
const SearchView = () => {
  const [formData, setData] = useState({});
  const [foodData, setFoodData] = useState<any[]>([]);
  const [groupData, setGroupData] = useState<any[]>([]);
  const [foodcateg, setFoodcateg] = useState<any[]>([]);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(()=>{
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

    }, [])
  );
  useEffect(() => {
    
  }, []);

  const produc = (id: string) => {

    console.log("name", id);

    console.log("getting", foodData);
    const filteredFood = foodData.filter(food => food.idFoodGroupFK === id);
    console.log("filtrado", filteredFood)
    setFoodcateg(filteredFood);
  }


  return (
    <Box backgroundColor='white' height={"$full"} width={"$full"} >
      <ScrollView  marginBottom={"$2"} marginTop={"$10px"} display='$flex' flexDirection='row'   horizontal={true}>
        {groupData.map((group, index) => (

          <Button marginBottom={"$5"} marginTop={"$10"} marginLeft={"$2"} onPress={() => produc(group.id)} backgroundColor='#FFA600' margin={"$5px"} key={index} size="md" variant="solid" alignContent='center' action="primary" isDisabled={false} isFocusVisible={false} >
            <ButtonText color='white' >{group.Name} </ButtonText>

          </Button>

        ))}

      </ScrollView>
      <ScrollView marginTop={"$2"} height={"$full"}>
        <VStack marginTop={"$3px"} backgroundColor='#FAF7F6' >
          {foodcateg.map((foof, index) => (
            <Card key={index} size="md" variant="elevated" m="$3" > 
              <Image
                mb="$6"
                h={120}
                width="$full" 
                borderRadius="$md"
                source={{
                  uri: `${Img + foof.Image}`,
                }}
              />
              <Heading mb="$1" size="md">
                {foof.Name}
              </Heading>
              <Text size="sm">
                {foof.Price}.00 $
              </Text>
              <Button action={"primary"} onPress={() => navigation.navigate('Details', { Id: foof.id })}
                backgroundColor={"#FFA600"} size={"lg"} width={"$full"} borderRadius={"$lg"} mt={"$2"}>
                <ButtonText>
                  See product
                </ButtonText>
               
              </Button>
            </Card>
          ))}
        </VStack>

      </ScrollView>
    </Box>
  );
};

export default SearchView;