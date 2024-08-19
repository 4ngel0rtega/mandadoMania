import { createContext, useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from 'react-native-uuid';

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {

    const [listProducts, setListProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [visibleEdit, setVisibleEdit] = useState(false);

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

    const addProduct = async ({name, price, place}) => {
        if (!name || !price) {
            Alert.alert("Campos vacíos", "Por favor, completa todos los campos antes de continuar.");
            return;
        }
    
        const newProduct = {
            id: uuid.v4(),
            name: name,
            price: price,
            place: place || null,
        };

        try {
            const existingList = await AsyncStorage.getItem("productList");
            let newList = [];

            if (existingList !== null && existingList !== '') {
                // Si la lista existe y no está vacía, parsearla
                newList = JSON.parse(existingList);
            }

            newList.push(newProduct);

            await AsyncStorage.setItem("productList", JSON.stringify(newList));
            Alert.alert("Producto Añadido","El producto fue añadido correctamente");

        } catch (error) {
            console.log("Error al añadir el producto", error)
        }
    }

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


    const deleteListProducts = async () => {
        try {
            await AsyncStorage.removeItem('productList');
            setListProducts([])
        } catch (error) {
            Alert.alert("Error", "Ups! Surgio un error al eliminar la lista, intentelo nuevamente")
            console.error("Error: " + error)
        }
    }

    return (
        <ProductsContext.Provider
            value={{
                listProducts,
                loading,
                currentProduct,
                visibleEdit,
                loadProducts,
                addProduct,
                showModalEdit,
                hideModalEdit,
                handleEditChange,
                saveProductChanges,
                confirmDeleteProduct,
                deleteListProducts
            }}
        >
            {children}
        </ProductsContext.Provider>
    )
}