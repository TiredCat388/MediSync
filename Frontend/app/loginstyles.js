import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const isTablet = width > 900;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    flexDirection: "column",
    justifyContent: "center", // Center the content vertically
    alignItems: "center", // Center the content horizontally
  },
  upperHalf: {
    flex: 1.5,
    backgroundColor: "#5879a5",
    justifyContent: "center", // Center logo and title vertically
    alignItems: "center", // Center logo and title horizontally
    width: "100%",
    paddingTop: 20, // Add some space at the top to prevent logo from sticking to the edge
    zIndex: 1,
  },
  lowerHalf: {
    flex: 2,
    backgroundColor: "white",
    width: "100%",
    alignItems: "center", // Center buttons and inputs horizontally
    justifyContent: "center", // Center buttons and inputs vertically
  },
  circleBackground: {
    width: isTablet ? 300 : 150,
    height: isTablet ? 300 : 150,
    borderRadius: 150,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 70,
  },
  logo: {
    width: isTablet ? 450 : 350,
    height: isTablet ? 450 : 350,
    resizeMode: "contain",
  },
  title: {
    zIndex: 0,
    fontSize: isTablet ? 40 : 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10, // Adjusted for proper spacing
  },
  roleContainer: {
    flexDirection: "column",
    justifyContent: "center", // Center buttons vertically in lower half
    alignItems: "center", // Center buttons horizontally
    marginVertical: 10,
    width: "100%",
  },
  roleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5879a5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 10,
    width: width * 0.35,
  },
  roleText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 25,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
    width: "80%",
    maxWidth: 400,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    maxWidth: 400,
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#BDBDBD",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  loginButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  loginText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },

  errorText: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});


export default styles;