import { createContext, useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from 'react-native-uuid';

export const ServicesContext = createContext();

export const ServicesProvider = ({ children }) => {


    const [listServices, setListServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentService, setCurrentService] = useState(null);
    const [visibleEditService, setVisibleEditService] = useState(false);

    const loadServices = async () => {
        try {
            const storedServices = await AsyncStorage.getItem('servicesList');
            if (storedServices !== null) {
                const parsedServices = JSON.parse(storedServices);
                setListServices(parsedServices);
    
            }
        } catch (error) {
            console.error('Error loading products', error);
        } finally {
            setLoading(false);
        }
    };

    const addService = async ({name, price, place}) => {
        if (!name || !price) {
            Alert.alert("Campos vacíos", "Por favor, completa todos los campos antes de continuar.");
            return;
        }
    
        const newService = {
            id: uuid.v4(),
            name: name,
            price: price,
            place: place || null,
            type: "service"
        };

        try {
            const existingList = await AsyncStorage.getItem("servicesList");
            let newList = [];

            if (existingList !== null && existingList !== '') {
                // Si la lista existe y no está vacía, parsearla
                newList = JSON.parse(existingList);
            }

            newList.push(newService);

            await AsyncStorage.setItem("servicesList", JSON.stringify(newList));
            Alert.alert("Servicio Añadido","El servicio fue añadido correctamente");

        } catch (error) {
            console.log("Error el servicio el producto", error)
        }
    }

    const showModalEditService = (service) => {
        setCurrentService(service);
        setVisibleEditService(true);
    };
    
    const hideModalEditService = () => {
        setVisibleEditService(false);
        setCurrentService(null);
    };

    const handleEditChangeService = (field, value) => {
        setCurrentService({ ...currentService, [field]: value });
    };

    const saveProductChangesService = async () => {
        try {
            // Validación para asegurarse de que todos los campos estén completos
            if (!currentService?.name || !currentService?.price) {
                Alert.alert('Error', 'Por favor, completa todos los campos antes de guardar.');
                return; // Salir de la función si hay campos vacíos
            }
    
            const updatedList = listServices.map((service) =>
                service.id === currentService.id ? currentService : service
            );
    
            setListServices(updatedList);
            await AsyncStorage.setItem('servicesList', JSON.stringify(updatedList));
            
            hideModalEditService();
        } catch (error) {
            console.error('Error saving product changes', error);
        }
    };

    const confirmDeleteService = (service) => {
        Alert.alert(
            'Eliminar Producto',
            `¿Estás seguro de que quieres eliminar ${service.name}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', onPress: () => deleteService(service.id) }
            ]
        );
    };

    const deleteService = async (serviceId) => {
        try {
            const updatedList = listServices.filter(service => service.id !== serviceId);
            setListServices(updatedList);
            await AsyncStorage.setItem('servicesList', JSON.stringify(updatedList));
        } catch (error) {
            console.error('Error deleting product', error);
        }
    };

    const deleteListServices = async () => {
        try {
            await AsyncStorage.removeItem('servicesList');
            setListServices([])
        } catch (error) {
            Alert.alert("Error", "Ups! Surgio un error al eliminar la lista, intentelo nuevamente")
            console.error("Error: " + error)
        }
    }

    return (
        <ServicesContext.Provider
            value={{
                listServices,
                loading,
                currentService,
                visibleEditService,
                loadServices,
                addService,
                showModalEditService,
                hideModalEditService,
                handleEditChangeService,
                saveProductChangesService,
                confirmDeleteService,
                deleteListServices
            }}
        >
            {children}
        </ServicesContext.Provider>
    )
}