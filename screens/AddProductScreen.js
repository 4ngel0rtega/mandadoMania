import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { RadioButton } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import uuid from 'react-native-uuid';

function AddProduct({navigation}) {

    const [ name, setName ] = useState("");
    const [ price, setPrice ] = useState("");
    const [ place, setPlace ] = useState("");

    const addProductList = async () => {
        if (!name || !price) {
            Alert.alert("Campos vacíos", "Por favor, completa todos los campos antes de continuar.");
            return;
        }
    
        const newProduct = {
            id: uuid.v4(),
            nombre,
            precio,
            lugar: lugar || null,
        };

        try {
            const productos = await AsyncStorage.getItem('productos');
            const productosArray = productos ? JSON.parse(productos) : [];
            productosArray.push(nuevoProducto);
            await AsyncStorage.setItem('productos', JSON.stringify(productosArray));
            Alert.alert('Éxito', 'Producto guardado correctamente.');
            setName('');
            setPrice('');
            setPlace('');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Hubo un problema al guardar el producto.');
        }
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={{marginBottom: 5}}>
                <View style={{flexDirection: "row", margin: "3%", alignItems: "center"}}>
                    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                        <Ionicons size={25} color={"#000"} name="arrow-back"/>
                    </TouchableOpacity>
                    <Text style={{fontSize: 18, textAlign: "center", width: "90%"}}>Agregar Producto</Text>
                </View>

                <View style={{padding: "2%", alignItems: "center"}}>
                    <Text style={{textAlign: "center", fontSize: 16, width: "80%"}}>
                        En esta pantalla ingresa los datos solicitados para agregar el producto a la lista del mandado
                    </Text>
                </View>
            </View>

            <View style={{flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 50, borderTopRightRadius: 50, padding: "2%"}}>
                <Text style={{fontSize: 20, textAlign: "center"}}>Descripción del Producto</Text>

                <View style={{justifyContent: "center", padding: "3%", marginVertical: 10}}>
                    <View style={{height: "100%", gap: 20}}>
                        <View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Nombre del Producto<Text style={styles.inputRequired}>*</Text></Text>
                                <TextInput onChangeText={(value) => setName(value)} style={styles.input} placeholder="Manzana, Naranja, Pan, etc."/>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Precio del Producto<Text style={styles.inputRequired}>*</Text></Text>
                                <TextInput onChangeText={(value) => setPrice(value)} vkeyboardType="numeric" style={styles.input} placeholder="20, 10, 19.55, etc."/>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Lugar de compra <Text style={{color: "#aaa"}}>(opcional)</Text></Text>
                                <TextInput onChangeText={(value) => setPlace(value)} style={styles.input} placeholder="Alsuper, Walmart, Costco, etc."/>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.button} onPress={() => addProductList()}>
                            <Text style={styles.buttonText}>Agregar</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default AddProduct;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffc44b"
    },
    
    inputContainer: {
        marginVertical: 10
    },  

    label: {
        fontSize: 16,
    },

    input: {
        fontSize: 14,
        padding: "2%",
        borderBottomWidth: 1,
        borderBottomColor: "#888"
    },

    inputRequired: {
        color: "#e00"
    },

    button: {
        padding: "3%",
        backgroundColor: "#3eb6ff",
        borderRadius: 10
    },

    buttonText: {
        fontSize: 18,
        color: "#fff",
        textAlign: "center"
    }
})