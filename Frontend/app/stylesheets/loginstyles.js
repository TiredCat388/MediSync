import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const isTablet = width > 900;
const circleSize = isTablet ? 350 : 250;
const logoSize = circleSize * 0.8; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    position: "relative",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  upperHalf: {
    flex: 1,
    backgroundColor: "#5879A5",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    zIndex: 1,
  },
  lowerHalf: {
    flex: 2,
    backgroundColor: "#F8F8F8",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 60,
    zIndex: 2,
  },
  circleBackground: {
    position: "relative",
    top: "30%",
    bottom: 30,
    width: circleSize,
    height: circleSize,
    backgroundColor: "#F8F8F8",
    borderRadius: circleSize / 2,
    alignItems: "center",
    justifyContent: "center",
    margintTop: 20,
  },
  logo: {
    width: logoSize,
    height: logoSize,
  },
  title: {
    zIndex: 4,
    fontSize: isTablet ? 40 : 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  roleContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
  },
  roleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5879A5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 10,
    width: "40%",
  },
  roleText: {
    color: "#F8F8F8",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 25,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
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
    maxWidth: 300,
    marginTop: 20,
    zIndex: 2,
  },
  cancelButton: {
    backgroundColor: "#808080",
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
    backgroundColor: "#5879A5",
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