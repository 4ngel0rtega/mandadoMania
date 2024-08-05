import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "../components/navbar";
import { useEffect, useState } from "react";
import { ActivityIndicator, FAB } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";


function Home({ navigation }) {
    const [listProducts, setListProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getDataProducts = async () => {
            setLoading(true);
            try {
                const jsonProducts = await AsyncStorage.getItem("list-products");
                const parsedProducts = JSON.parse(jsonProducts) || []; // Parsea los datos
                console.log(parsedProducts)
                setListProducts(parsedProducts);
                setLoading(false);
            } catch (e) {
                Alert.alert("Error", "Error al cargar la lista de productos, inténtelo de nuevo");
                console.log(e)
            }
        };        

        getDataProducts();
    }, []);

    const renderEmptyListMessage = () => (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Sin productos disponibles</Text>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Navbar/>

            {loading ? (
                <ActivityIndicator style={{marginTop: 5}} size="large" color="#007BAF" />
            ) : (
                <FlatList
                    data={listProducts}
                    keyExtractor={(product) => product.id} // Assuming product.id is a string or number
                    renderItem={({ item }) => <Text>{item.name}</Text>}
                    // ListEmptyComponent={renderEmptyListMessage} // Show this when listProducts is empty
                />
            )}

            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => navigation.navigate("AddProduct")}
            />
        </SafeAreaView>
    );
}


export default Home;

const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },
})