import { Alert, Animated, FlatList, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "../components/navbar";
import { useCallback, useContext, useRef, useState } from "react";
import { Checkbox, Divider, Modal } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from "@react-navigation/native";
import { ProductsContext } from "../context/ProductsContext";
import { ServicesContext } from "../context/ServicesContext";


function Home({ navigation }) {

    const [isProductListVisible, setIsProductListVisible] = useState(false);
    const animationProductsList = useRef(new Animated.Value(1)).current;

    const [isServicesListVisible, setIsServicesListVisible] = useState(false);
    const animationServicesList = useRef(new Animated.Value(1)).current;

    const {
        listProducts,
        loadProducts,
        visibleEdit,
        currentProduct,
        showModalEdit,
        hideModalEdit,
        handleEditChange,
        saveProductChanges,
        confirmDeleteProduct,
        deleteListProducts
    } = useContext(ProductsContext);

    const {
        listServices,
        currentService,
        visibleEditService,
        loadServices,
        showModalEditService,
        hideModalEditService,
        handleEditChangeService,
        saveProductChangesService,
        confirmDeleteService,
        deleteListServices
    } = useContext(ServicesContext);

    useFocusEffect(
        useCallback(() => {
        // Se ejecuta cada vez que la pantalla se enfoca
        loadProducts();
        loadServices();
        }, [])
    );

    const toggleProductListVisibility = () => {
        if (!isProductListVisible) {
            // Ocultar la lista de servicios si está visible
            Animated.timing(animationServicesList, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
            }).start();
            setIsServicesListVisible(false);
        }
    
        Animated.timing(animationProductsList, {
            toValue: !isProductListVisible ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
        setIsProductListVisible(!isProductListVisible);
    };
    
    const toggleServicesListVisibility = () => {
        if (!isServicesListVisible) {
            // Ocultar la lista de productos si está visible
            Animated.timing(animationProductsList, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
            }).start();
            setIsProductListVisible(false);
        }
    
        Animated.timing(animationServicesList, {
            toValue: !isServicesListVisible ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
        setIsServicesListVisible(!isServicesListVisible);
    };
    

    const rotateIconProducts = animationProductsList.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '0deg'],
    });

    const rotateIconServices = animationServicesList.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '0deg'],
    });

    const renderEmptyListMessage = () => (
        <View style={{ alignItems: 'center', marginTop: 5 }}>
            <Text>Lista Vacia</Text>
        </View>
    );

    
    const [ isDeleteList, setIsDeleteList ] = useState(false);
    const [ isDeleteListProducts, setIsDeleteListProducts ] = useState(false);
    const [ isDeleteListServices, setIsDeleteListServices ] = useState(false);

    const confirmDeleteList = () => {
        if ( !isDeleteListProducts && !isDeleteListServices) {
            Alert.alert("Advertencia", "Por favor selecciona una lista a vaciar para continuar");
            return;
        }

        Alert.alert(
            'Vaciar Lista(s)',
            `¿Estás segudo de que quieres vaciar la lista o listas?`,
            [
                {text: 'Cancelar', style: 'cancel'},
                {text: 'Eliminar', onPress: () => deleteList()}
            ]
        )
    }

    const deleteList = async () => {
 
        if ( isDeleteListProducts && isDeleteListServices) {
            deleteListProducts();
            deleteListServices();
        } else if ( isDeleteListProducts ) {
            deleteListProducts()
        } else {
            deleteListServices();
        }

        Alert.alert("Listas Vaciadas", "Se vaciaron las listas correctamente.");
        setIsDeleteList(false)
        setIsDeleteListProducts(false);
        setIsDeleteListServices(false);
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar
                backgroundColor={"#333333"}
                barStyle={"light-content"}
            />
            <Navbar />
    
            <View style={{marginVertical: 10, padding: 5, flexDirection: "row", justifyContent: "space-around"}}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('AddProduct')}
                    style={{ padding: 10, backgroundColor: '#F0AB56', borderRadius: 10 }}
                >
                    <Ionicons name="bag-add-outline" size={30} color={"#fff"}/>
                    {/* <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center' }}>Añadir Producto</Text> */}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('AddService')}
                    style={{ padding: 10, backgroundColor: '#42D0F0', borderRadius: 10 }}
                >
                    <Ionicons name="water-outline" size={30} color={"#fff"}/>
                    {/* <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center' }}>Añadir Servicio</Text> */}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setIsDeleteList(!isDeleteList)}
                    style={{ padding: 10, backgroundColor: '#DF1616', borderRadius: 10 }}
                >
                    <Ionicons name={isDeleteList ? "trash" : "trash-outline"} size={30} color={"#fff"}/>
                    {/* <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center' }}>Añadir Servicio</Text> */}
                </TouchableOpacity>
            </View>
    

            <View style={{flex: 1}}>
                <View style={{padding: 5, marginTop: 10}}>
                    <Text style={{fontSize: 16, borderBottomWidth: 1, padding: 5}}>Listas de mandado</Text>
                </View>

                <View style={{flexDirection: "row", margin: 5, padding: 10, borderRadius: 5, backgroundColor: "#7AB83D"}}>
                    {isDeleteList && <Checkbox.Item color="#CC1414" status={isDeleteListProducts ? "checked" : "unchecked"} onPress={() => setIsDeleteListProducts(!isDeleteListProducts)}/>}
                    <TouchableOpacity onPress={() => toggleProductListVisibility()} style={{flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                        <View style={{flexDirection: "row"}}>
                        
                            <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
                                <Ionicons name="basket" color={"#FFF"} size={30}/>
                                <Text style={{fontSize: 16, fontWeight: 800, color: "#FFF"}}>Productos</Text>
                            </View>
                        </View>

                        <Animated.View style={{ transform: [{ rotate: rotateIconProducts }] }}>
                            <Ionicons name="chevron-up" color={"#FFF"} size={25}/>
                        </Animated.View>
                    </TouchableOpacity>
                </View>

                <Animated.View style={{ maxHeight: animationProductsList.interpolate({ inputRange: [0, 1], outputRange: [250, 0] }), overflow: 'hidden' }}>
                    <FlatList
                        data={listProducts}
                        style={{padding: "2%",}}
                        keyExtractor={(product) => product.id.toString()} // Asegúrate de que product.id sea una cadena o número
                        renderItem={({ item }) => {
                            return (
                                <View style={{padding: 5}}>
                                    <View style={{padding: 10, borderRadius: 10, backgroundColor: "#e2e2e2", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                        <View style={{width: "60%"}}>
                                            <Text style={{fontSize: 20, fontWeight: 800}}>{item.name}<Text style={{fontSize: 14, fontWeight: 400}}> - {item.place ? item.place : "Sin Lugar"}</Text></Text>
                                            <Text style={{fontSize: 16, fontWeight: 600}}>${item.price}</Text>
                                        </View>
                                        <View style={{flexDirection: "row"}}>
                                            <TouchableOpacity onPress={() => showModalEdit(item)} style={{backgroundColor: "#6CD7EF", padding: 10, borderRadius: 5, marginHorizontal: 2}}>
                                                <Ionicons name="pencil" color={"#fff"} size={20}/>
                                            </TouchableOpacity>
                                            <TouchableOpacity    onPress={() => confirmDeleteProduct(item)} style={{backgroundColor: "#F06A6A", padding: 10, borderRadius: 5, marginHorizontal: 2}}>
                                                <Ionicons name="close" color={"#fff"} size={20}/>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )
                        }}
                        ListEmptyComponent={renderEmptyListMessage} // Mostrar esto cuando listProducts esté vacío
                        />
                </Animated.View>

                <View style={{flexDirection: "row", margin: 5, padding: 10, borderRadius: 5, backgroundColor: "#7AB83D"}}>
                        {isDeleteList && <Checkbox.Item color="#CC1414" status={isDeleteListServices ? "checked" : "unchecked"} onPress={() => setIsDeleteListServices(!isDeleteListServices)}/>}
                        <TouchableOpacity onPress={() => toggleServicesListVisibility()} style={{flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                            <View style={{flexDirection: "row"}}>
                            
                                <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
                                    <Ionicons name="bulb" color={"#FFF"} size={30}/>
                                    <Text style={{fontSize: 16, fontWeight: 800, color: "#FFF"}}>Servicios</Text>
                                </View>
                            </View>

                            <Animated.View style={{ transform: [{ rotate: rotateIconServices }] }}>
                                <Ionicons name="chevron-up" color={"#FFF"} size={25}/>
                            </Animated.View>
                        </TouchableOpacity>
                </View>

                <Animated.View style={{ maxHeight: animationServicesList.interpolate({ inputRange: [0, 1], outputRange: [250, 0] }), overflow: 'hidden' }}>
                    <FlatList
                        data={listServices}
                        style={{padding: "1%"}}
                        keyExtractor={(service) => service.id.toString()} // Asegúrate de que product.id sea una cadena o número
                        renderItem={({ item }) => {
                            return (
                                <View style={{padding: 5}}>
                                    <View style={{padding: 10, borderRadius: 10, backgroundColor: "#e2e2e2", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                        <View style={{width: "60%"}}>
                                            <Text style={{fontSize: 20, fontWeight: 800}}>{item.name} - <Text style={{fontSize: 14, fontWeight: 400}}>{item.place ? item.place : "Sin Lugar"}</Text></Text>
                                            <Text style={{fontSize: 16, fontWeight: 600}}>${item.price}</Text>
                                        </View>
                                        <View style={{flexDirection: "row"}}>
                                            <TouchableOpacity onPress={() => showModalEditService(item)} style={{backgroundColor: "#6CD7EF", padding: 10, borderRadius: 5, marginHorizontal: 2}}>
                                                <Ionicons name="pencil" color={"#fff"} size={20}/>
                                            </TouchableOpacity>
                                            <TouchableOpacity    onPress={() => confirmDeleteService(item)} style={{backgroundColor: "#F06A6A", padding: 10, borderRadius: 5, marginHorizontal: 2}}>
                                                <Ionicons name="close" color={"#fff"} size={20}/>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )
                        }}
                        ListEmptyComponent={renderEmptyListMessage} // Mostrar esto cuando listProducts esté vacío
                    />
                </Animated.View>

                
                { isDeleteList ? (
                        <TouchableOpacity onPress={() => confirmDeleteList()} style={{margin: 10, padding: 10, backgroundColor: "#DF1616", borderRadius: 5}}>
                            <Text style={{color: "#fff", textAlign: "center", fontWeight: 500}}>Eliminar Lista</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => navigation.navigate("Details")} style={{margin: 10, padding: 10, backgroundColor: "#669933", borderRadius: 5}}>
                            <Text style={{color: "#fff", textAlign: "center", fontWeight: 500}}>Detalles de la Compra</Text>
                        </TouchableOpacity>
                    )
                }
            </View>

            <Modal visible={visibleEdit} onDismiss={hideModalEdit} onRequestClose={hideModalEdit} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: '#fff', borderRadius: 5, padding: 10, height: 410, width: 300 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                        <Text style={{ fontSize: 22, flex: 1, textAlign: 'center', fontWeight: 800}}>Editar Producto</Text>
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
                            value={currentProduct?.price?.toString()}
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

                        <TouchableOpacity onPress={() => saveProductChanges()} style={{margin: 5, padding: 10, backgroundColor: "#16A9CA", borderRadius: 5}}>
                            <Text style={{color: "#fff", textAlign: "center", fontSize: 16, fontWeight: 500}}>Guardar</Text>
                        </TouchableOpacity>
                        
                    </View>
                </View>
            </Modal>

            <Modal visible={visibleEditService} onDismiss={hideModalEditService} onRequestClose={hideModalEditService} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: '#fff', borderRadius: 5, padding: 10, height: 410, width: 300 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                    <Text style={{ fontSize: 22, flex: 1, textAlign: 'center' }}>Editar Servicio</Text>
                    <Ionicons name="close" color="#888" size={25} onPress={hideModalEditService} />
                    </View>

                    <Divider bold />

                    <Text style={{margin: 5, fontSize: 14, color: 666, fontWeight: 500}}>A continuación ingresa los cambios correspondientes y da click en guardar</Text>
                    <View style={{padding: 5, margin: 2}}>
                            <View style={styles.inputContainer}>
                            <Text style={styles.label}>Nombre del Servicio</Text>
                            <TextInput
                            style={styles.input}
                            value={currentService?.name}
                            onChangeText={(value) => handleEditChangeService('name', value)}
                            placeholder="Nombre del Servicio"
                            />
                            </View>
                    
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Precio del Servicio</Text>
                            <TextInput
                            style={styles.input}
                            value={currentService?.price}
                            onChangeText={(value) => handleEditChangeService('price', value)}
                            placeholder="Precio del Servicio"
                            keyboardType="numeric"
                            />
                        </View>
                    
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Lugar de pago</Text>
                            <TextInput
                            style={styles.input}
                            value={currentService?.place}
                            onChangeText={(value) => handleEditChangeService('place', value)}
                            placeholder="Lugar de pago"
                            />
                        </View>

                        <TouchableOpacity onPress={() => saveProductChangesService()} style={{margin: 5, padding: 10, backgroundColor: "#16A9CA", borderRadius: 5}}>
                            <Text style={{color: "#fff", textAlign: "center", fontSize: 16, fontWeight: 500}}>Guardar</Text>
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
        fontSize: 16,
    },
    input: {
        fontSize: 14,
        padding: 5,
        color: "#555",
        borderBottomWidth: 1,
        borderBottomColor: "#aaa"
    }
})