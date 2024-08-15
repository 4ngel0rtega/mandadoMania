import { SafeAreaView } from "react-native-safe-area-context"
import Navbar from "../components/navbar"
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


function Details({navigation}) {
    const [listProducts, setListProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);

    const renderEmptyListMessage = () => (
        <View style={{ alignItems: 'center', marginTop: 5 }}>
        <Text>No hay productos ha comprar.</Text>
        </View>
    );

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true)
                const storedProducts = await AsyncStorage.getItem('productList');
                if (storedProducts !== null) {
                  const parsedProducts = JSON.parse(storedProducts);
                  setListProducts(parsedProducts);
          
                  // Calcular el precio total
                  const total = parsedProducts.reduce((sum, product) => {
                    return sum + parseFloat(product.price);
                  }, 0);
          
                  setTotalPrice(total);
                }
              } catch (error) {
                console.error('Error loading products', error);
              } finally {
                setLoading(false)
              }
        };

        loadProducts()
    }, [])

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#8DD941"}}>
            <View style={{marginBottom: 5}}>
                <View style={{flexDirection: "row", margin: "3%", alignItems: "center"}}>
                    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                        <Ionicons size={25} color={"#000"} name="arrow-back"/>
                    </TouchableOpacity>
                    <Text style={{fontSize: 18, textAlign: "center", width: "90%", color: "#fff"}}>Detalles de Compra</Text>
                </View>

                <View style={{padding: "2%", alignItems: "center"}}>
                    <Text style={{textAlign: "center", fontSize: 16, width: "80%", color: "#fff"}}>
                        En esta pantalla se ve un resumen con los gastos segun los productos que ingreso
                    </Text>
                </View>
            </View>

            <View style={{flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 50, borderTopRightRadius: 50, padding: "2%"}}>
                <Text style={{fontSize: 24, textAlign: "center", fontWeight: 800}}>Resumen de compra</Text>

                { !loading &&
                    <FlatList
                    data={listProducts}
                    keyExtractor={(product) => product.id.toString()}
                    renderItem={({item}) => {
                        return (
                            <View style={{paddingHorizontal: "5%", paddingVertical: "2%", borderBottomWidth: 1, borderBottomColor: "#aaa", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                <Text style={{fontSize: 20, fontWeight: 600}}>{item.name}</Text>

                                <Text style={{fontSize: 14, fontWeight: 400, color: "#F2B56B"}}>${item.price}</Text>
                            </View>
                        )
                    }}
                    ListEmptyComponent={renderEmptyListMessage}
                />
                }

                <View style={{borderTopWidth: 1, borderTopColor: "#222"}}>
                    <Text style={{textAlign: "right", fontSize: 18, fontWeight: 500, margin: 10}}>Total: <Text style={{fontSize: 20, fontWeight: 800, color: "#49B2CC"}}>${totalPrice}</Text></Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Details;