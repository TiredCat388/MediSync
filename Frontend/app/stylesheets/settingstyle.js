import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
container: {
    flex: 1,
    paddingHorizontal: 40,
    paddingBottom: 40,
    backgroundColor: "#F8F8F8",
},
heading: {
    paddingVertical: 20,
    fontSize: 30,
    fontWeight: "bold",
    color: "#000000",
},
thumbStyle: {
    width: 20,
    height: 20,
    borderRadius: 15,
    backgroundColor: "#5879A5",
},
label: {
    fontSize: 25,
    marginBottom: 10,
    color: "#000",
},
volumeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 50,
},
sliderWrapper: {
    width: "85%",
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "#808080",
    borderRadius: 15,
},
slider: {
    flex: 1,
    height: 50,
    marginHorizontal: 10,
    borderRadius: 15,
},
pickerWrapper: {
    width: "90%",
    borderWidth: 2,
    borderColor: "#808080",
    borderRadius: 12,
},
picker: {
    height: 50,
    fontSize: 16,
    paddingLeft: 15,
    borderWidth: 0,
    width: "100%",
    color: "#808080",
},
trackBackground: {
    height: 25,
    borderRadius: 12,
    justifyContent: "center",
},
saveButtonWrapper: {
    marginTop: 30,
    alignItems: "flex-end",
},
saveButton: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
},
saveButtonText: {
    fontSize: 18,
    color: "#ffffff",
},
});

export default styles;