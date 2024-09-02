import { SafeAreaView } from "react-native-safe-area-context"
import Navbar from "../components/navbar"
import { FlatList, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProductsContext } from "../context/ProductsContext";
import { ServicesContext } from "../context/ServicesContext";


function Details({navigation}) {
    const [ listShooping, setListShooping ]  = useState([])
    const [totalPrice, setTotalPrice] = useState(0);

    const {
        listProducts,
        totalProducts,
    } = useContext(ProductsContext);

    const {
        listServices,
        totalServices,
    } = useContext(ServicesContext);

    const renderEmptyListMessage = () => (
        <View style={{ alignItems: 'center', marginTop: 5 }}>
        <Text>No hay productos ha comprar.</Text>
        </View>
    );

    useEffect(() => {
        const loadShopping = async () => {
            const listMix = [...listProducts, ...listServices];
            setListShooping(listMix);

            const cost = listMix.reduce((sum, product) => {
                return sum + parseFloat(product.price)
            }, 0)

            setTotalPrice(cost)
        };

        loadShopping()
    }, [])

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#63C067"}}>
            <StatusBar
                backgroundColor={"#333333"}
                barStyle={"light-content"}
            />
            <View style={{marginBottom: 5}}>
                <View style={{flexDirection: "row", margin: "3%", alignItems: "center"}}>
                    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                        <Ionicons size={25} color={"#FFF"} name="arrow-back"/>
                    </TouchableOpacity>
                    <Text style={{fontSize: 18, textAlign: "center", width: "90%", color: "#fff"}}>Detalles de Compra</Text>
                </View>

                <View style={{padding: "2%", alignItems: "center"}}>
                    <Text style={{textAlign: "center", fontSize: 16, width: "80%", color: "#fff"}}>
                        En esta pantalla se ve un resumen con los gastos segun los productos/servicios que ingreso
                    </Text>
                </View>
            </View>

            <View style={{flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 50, borderTopRightRadius: 50, padding: "2%"}}>
                <Text style={{fontSize: 24, textAlign: "center", fontWeight: 800}}>Lista de la compra</Text>


                <FlatList
                    data={listShooping}
                    keyExtractor={(product) => product.id.toString()}
                    renderItem={({item}) => {
                        return (
                            <View style={{paddingHorizontal: "5%", paddingVertical: "2%", borderBottomWidth: 1, borderBottomColor: "#aaa", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                <Text style={{fontSize: 18, fontWeight: 600, width: "75%"}}>{item.name} <Text style={{fontSize: 14, fontWeight: 300, color: "#777"}}> - {item.type === 'product' ? 'Producto' : 'Servicio'}</Text></Text>

                                <Text style={{fontSize: 14, fontWeight: 400, color: item.type === 'product' ? '#049aeb' : '#07aba3'}}>${item.price}</Text>
                            </View>
                        )
                    }}
                    ListEmptyComponent={renderEmptyListMessage}
                />

                <View style={{borderTopWidth: 1, borderTopColor: "#222"}}>
                    <Text style={{fontSize: 14, fontWeight: 500, margin: 2}}>Productos: <Text style={{fontSize: 16, fontWeight: 600, color: "#049aeb"}}>${totalProducts}</Text></Text>
                    <Text style={{fontSize: 14, fontWeight: 500, margin: 2}}>Servicios: <Text style={{fontSize: 16, fontWeight: 600, color: "#07aba3"}}>${totalServices}</Text></Text>
                    <Text style={{fontSize: 14, fontWeight: 600, margin: 2}}>Total: <Text style={{fontSize: 18, fontWeight: 800, color: "#449b47"}}>${totalPrice}</Text></Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Details;