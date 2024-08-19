import { useContext, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { ProductsContext } from "../context/ProductsContext";

function AddProduct({navigation}) {

    const { addProduct } = useContext(ProductsContext)
    const [ name, setName ] = useState("");
    const [ price, setPrice ] = useState("");
    const [ place, setPlace ] = useState("");

    const handleAddProduct = () => {
        addProduct({ name, price, place });
        setName('');
        setPrice('');
        setPlace('');
    };

    
    return (
        <SafeAreaView style={styles.container}>
            <View style={{marginBottom: 5}}>
                <View style={{flexDirection: "row", margin: "3%", alignItems: "center"}}>
                    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                        <Ionicons size={25} color={"#000"} name="arrow-back"/>
                    </TouchableOpacity>
                    <Text style={{fontSize: 18, textAlign: "center", width: "90%", color: "#fff"}}>Agregar Producto</Text>
                </View>

                <View style={{padding: "2%", alignItems: "center"}}>
                    <Text style={{textAlign: "center", fontSize: 16, width: "80%", color: "#fff"}}>
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
                                <TextInput value={name} onChangeText={(value) => setName(value)} style={styles.input} placeholder="Manzana, Naranja, Pan, etc."/>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Precio del Producto<Text style={styles.inputRequired}>*</Text></Text>
                                <TextInput value={price} onChangeText={(value) => setPrice(value)} keyboardType="decimal-pad" style={styles.input} placeholder="20, 10, 19.55, etc."/>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Lugar de compra <Text style={{color: "#aaa"}}>(opcional)</Text></Text>
                                <TextInput value={place} onChangeText={(value) => setPlace(value)} style={styles.input} placeholder="Alsuper, Walmart, Costco, etc."/>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.button} onPress={() => handleAddProduct()}>
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
        backgroundColor: "#ECA956"
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
        backgroundColor: "#E29646",
        borderRadius: 10
    },

    buttonText: {
        fontSize: 18,
        color: "#fff",
        textAlign: "center"
    }
})