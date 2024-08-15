import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "../components/navbar";
import { useCallback, useState } from "react";
import { ActivityIndicator, Divider, Modal } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from "@react-navigation/native";


function Home({ navigation }) {
    const [listProducts, setListProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [currentProduct, setCurrentProduct] = useState(null);


    const [visibleEdit, setVisibleEdit] = useState(false);
    const showModalEdit = (product) => {
        setCurrentProduct(product);
        setVisibleEdit(true);
    };
      
    const hideModalEdit = () => {
        setVisibleEdit(false);
        setCurrentProduct(null);
    };

    const handleEditChange = (field, value) => {
        setCurrentProduct({ ...currentProduct, [field]: value });
    };

    const saveProductChanges = async () => {
        try {
            // Validación para asegurarse de que todos los campos estén completos
            if (!currentProduct?.name || !currentProduct?.price) {
                Alert.alert('Error', 'Por favor, completa todos los campos antes de guardar.');
                return; // Salir de la función si hay campos vacíos
            }
    
            const updatedList = listProducts.map((product) =>
                product.id === currentProduct.id ? currentProduct : product
            );
    
            setListProducts(updatedList);
            await AsyncStorage.setItem('productList', JSON.stringify(updatedList));
            
            hideModalEdit();
        } catch (error) {
            console.error('Error saving product changes', error);
        }
    };
    
    const confirmDeleteProduct = (product) => {
        Alert.alert(
            'Eliminar Producto',
            `¿Estás seguro de que quieres eliminar ${product.name}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', onPress: () => deleteProduct(product.id) }
            ]
        );
    };
    
    const deleteProduct = async (productId) => {
        try {
            const updatedList = listProducts.filter(product => product.id !== productId);
            setListProducts(updatedList);
            await AsyncStorage.setItem('productList', JSON.stringify(updatedList));
        } catch (error) {
            console.error('Error deleting product', error);
        }
    };

    const confirmDeleteList = (product) => {
        Alert.alert(
            'Eliminar Lista',
            `¿Estás seguro de que quieres eliminar toda la lista?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', onPress: () => deleteList() }
            ]
        );
    };

    const deleteList = async () => {
        try {
            await AsyncStorage.removeItem('productList');
            setListProducts([])
        } catch (error) {
            Alert.alert("Error", "Ups! Surgio un error al eliminar la lista, intentelo nuevamente")
            console.error("Error: " + error)
        }
    }

    const loadProducts = async () => {
        try {
            const storedProducts = await AsyncStorage.getItem('productList');
            if (storedProducts !== null) {
              const parsedProducts = JSON.parse(storedProducts);
              setListProducts(parsedProducts);
      
            }
          } catch (error) {
            console.error('Error loading products', error);
          } finally {
            setLoading(false);
          }
    };

    useFocusEffect(
        useCallback(() => {
        // Se ejecuta cada vez que la pantalla se enfoca
        loadProducts();
        }, [])

    );

    const renderEmptyListMessage = () => (
        <View style={{ alignItems: 'center', marginTop: 5 }}>
        <Text>No hay productos en la lista.</Text>
        </View>
    );


    return (
        <SafeAreaView style={{ flex: 1 }}>
          <Navbar />
    
          <TouchableOpacity
            onPress={() => navigation.navigate('AddProduct')}
            style={{ margin: 10, padding: 10, backgroundColor: '#ECA956', borderRadius: 10 }}
          >
            <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center' }}>Añadir Producto</Text>
          </TouchableOpacity>
    
          {loading ? (
            <ActivityIndicator style={{ marginTop: 5 }} size="large" color="#007BAF" />
          ) : (
            <FlatList
              data={listProducts}
              keyExtractor={(product) => product.id.toString()} // Asegúrate de que product.id sea una cadena o número
              renderItem={({ item }) => {
                return (
                    <View style={{padding: 5}}>
                        <View style={{padding: 10, borderRadius: 10, backgroundColor: "#e2e2e2", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                            <View>
                                <Text style={{fontSize: 20, fontWeight: 800}}>{item.name} - <Text style={{fontSize: 14, fontWeight: 400}}>{item.place ? item.place : "Sin Lugar"}</Text></Text>
                                <Text style={{fontSize: 16, fontWeight: 600}}>${item.price}</Text>
                            </View>
                            <View style={{flexDirection: "row"}}>
                                <TouchableOpacity onPress={() => showModalEdit(item)} style={{backgroundColor: "#4FBCD7", padding: 10, borderRadius: 5, marginHorizontal: 2}}>
                                    <Ionicons name="pencil" color={"#fff"} size={20}/>
                                </TouchableOpacity>
                                <TouchableOpacity    onPress={() => confirmDeleteProduct(item)} style={{backgroundColor: "#F16767", padding: 10, borderRadius: 5, marginHorizontal: 2}}>
                                    <Ionicons name="close" color={"#fff"} size={20}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )
              }}
              ListEmptyComponent={renderEmptyListMessage} // Mostrar esto cuando listProducts esté vacío
            />
          )}
            <Divider bold/>

            <View style={{padding: 10, flexDirection: "row", justifyContent: "space-between"}}>
                <TouchableOpacity onPress={() => navigation.navigate("Details")} style={{backgroundColor: "#A2C15C", padding: 10, borderRadius: 10}}>
                    <Text style={{fontSize: 16, color: "#fff"}}>Realizar Compra</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => confirmDeleteList()} style={{backgroundColor: "#C73A35", padding: 10, borderRadius: 10}}>
                    <Ionicons name="trash" size={20} color={"#fff"}/>
                </TouchableOpacity>
            </View>

            <Modal visible={visibleEdit} onDismiss={hideModalEdit} onRequestClose={hideModalEdit} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: '#fff', borderRadius: 5, padding: 10, height: 410, width: 300 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                    <Text style={{ fontSize: 22, flex: 1, textAlign: 'center' }}>Editar Producto</Text>
                    <Ionicons name="close" color="#888" size={25} onPress={hideModalEdit} />
                    </View>

                    <Divider bold />

                    <Text style={{margin: 5, fontSize: 14, color: 666, fontWeight: 500}}>A continuación ingresa los cambios correspondientes y da click en guardar</Text>
                    <View style={{padding: 5, margin: 2}}>
                            <View style={styles.inputContainer}>
                            <Text style={styles.label}>Nombre del Producto</Text>
                            <TextInput
                            style={styles.input}
                            value={currentProduct?.name}
                            onChangeText={(value) => handleEditChange('name', value)}
                            placeholder="Nombre del Producto"
                            />
                            </View>
                    
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Precio del Producto</Text>
                            <TextInput
                            style={styles.input}
                            value={currentProduct?.price}
                            onChangeText={(value) => handleEditChange('price', value)}
                            placeholder="Precio del Producto"
                            keyboardType="numeric"
                            />
                        </View>
                    
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Lugar de compra</Text>
                            <TextInput
                            style={styles.input}
                            value={currentProduct?.place}
                            onChangeText={(value) => handleEditChange('place', value)}
                            placeholder="Lugar de compra"
                            />
                        </View>

                        <TouchableOpacity onPress={saveProductChanges} style={{margin: 5, padding: 10, backgroundColor: "#369cef", borderRadius: 5}}>
                            <Text style={{color: "#fff", textAlign: "center", fontSize: 16}}>Guardar</Text>
                        </TouchableOpacity>
                        
                    </View>
                </View>
            </Modal>

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
    inputContainer: {
        marginVertical: 5
    },
    label: {
        fontSize: 16
    },
    input: {
        fontSize: 14,
        padding: 5,
        color: "#555",
        borderBottomWidth: 1,
        borderBottomColor: "#aaa"
    }
})