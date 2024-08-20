import { Image, Text, View } from "react-native";


function Navbar() {
    return (
        <View style={{padding: "2%", flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#C4C4C4", backgroundColor: "#fff"}}>
            <Image style={{width: 50, height: 60}} source={require("../assets/images/logo.png")}/>
            <Text style={{fontSize: 20, marginHorizontal: 10}}>Mandado Manía</Text>
        </View>
    )
}

export default Navbar;
