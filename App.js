import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { Camera } from "expo-camera";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    console.log(`QR detected ${data}`);
    setScanned(true);
    setResult(data);
  };

  const resetScanner = () => {
    setScanned(false);
    setResult(null);
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        ratio="1:1"
        barCodeScannerSettings={{
          barCodeTypes: ["qr", "pdf417"],
        }}
      />
      <View style={styles.overlay}>
        {scanned && (
          <View>
            <Text style={styles.text}>Result: {result}</Text>
            <Button title="Scan Again" onPress={resetScanner} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 500,
    width: 2000,
    alignSelf: "center",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    height: 500,
    width: 500,
  },
  overlay: {
    position: "absolute",
    bottom: -50,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 15,
  },
  text: {
    color: "white",
    fontSize: 18,
  },
});
