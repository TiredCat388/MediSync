import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const isTablet = width > 900;
const logoSize = isTablet ? 450 : 350;
const circleSize = logoSize * 0.7

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  upperHalf: {
    flex: 1.5,
    backgroundColor: "#5879a5",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingTop: 20,
  },
  lowerHalf: {
    flex: 2,
    backgroundColor: "white",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -20,
  },
  circleBackground: {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2, // Always keeps it a perfect circle
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 70,
    zIndex: 1,
  },
  logo: {
    width: logoSize,
    height: logoSize,
    resizeMode: "contain",
    zIndex: 3,
  },
  title: {
    zIndex: 1,
    fontSize: isTablet ? 40 : 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    marginTop: -70,
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
    width: width * 0.45,
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
    backgroundColor: "#5879a5",
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