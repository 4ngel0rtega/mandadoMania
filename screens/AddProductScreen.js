import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { RadioButton, Text } from "react-native-paper";
import uuid from 'react-native-uuid';

function AddProduct({navigation}) {

    const [ name, setName ] = useState("");
    const [ price, setPrice ] = useState("");
    const [ place, setPlace ] = useState("");

    const addProductList = async () => {
        if (name === "" || price === "") {
            Alert.alert("Campos vacíos", "Por favor, completa todos los campos antes de continuar.");
            return;
        }
    
        try {
            // 1. Cargar la lista de productos existente
            const existingProducts = await AsyncStorage.getItem("list-products");
            const productList = existingProducts ? JSON.parse(existingProducts) : [];
    
            // 2. Agregar el nuevo producto
            const idProduct = uuid.v4();
            const newProduct = {
                id: idProduct,
                nameProduct: name,
                price: price,
                place: place
            };
            productList.push(newProduct);
    
            // 3. Guardar la lista actualizada
            await AsyncStorage.setItem("list-products", JSON.stringify(productList));
    
            console.log("Producto agregado:", newProduct);
            setName("");
            setPrice("");
            setPlace("");
            navigation.navigate("Home");
        } catch (e) {
            Alert.alert("Error", "Lo sentimos, ocurrió un error. Por favor, inténtelo de nuevo.");
        }
    }
    
    
    

    return (
        <View style={{padding: "2%"}}>
            <View>
                <Text style={{fontSize: 16, textAlign: "center"}}>
                Completa los campos a continuación para añadir un nuevo producto a tu lista de mandado
                </Text>
            </View>

            <View style={{marginHorizontal: "2%", marginVertical: "5%", padding: "3%", borderRadius: 5, backgroundColor: "#fff"}}>
                <Text style={{fontSize: 20}}>Descripción del producto:</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nombre:</Text>
                    <TextInput value={name} onChangeText={(value) => setName(value)} style={styles.input} placeholder="Ingrese el nombre del producto"/>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Precio:</Text>
                    <TextInput value={price} onChangeText={(value) => setPrice(value)} keyboardType="numeric" style={styles.input} placeholder="Ingrese el precio del producto"/>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Lugar:</Text>
                    <TextInput value={place} onChangeText={(value) => setPlace(value)} style={styles.input} placeholder="Ingrese el lugar de compra (opcional)"/>
                </View>

                <View style={{alignItems: "center", marginVertical: 10}}>
                    <TouchableOpacity style={styles.button} onPress={() => addProductList()}>
                        <Text style={{fontSize: 18, color: "#fff",textAlign: "center"}}>
                            Agregar
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default AddProduct;

const styles = StyleSheet.create({
    inputContainer: {
        marginVertical: 10,
        marginHorizontal: 10,
    },
    label: {
        fontSize: 16
    },
    input: {
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#000"
    },

    button: {
        padding: "2%",
        width: "50%",
        borderRadius: 5, 
        backgroundColor: "#1ba2e5"
    }
})