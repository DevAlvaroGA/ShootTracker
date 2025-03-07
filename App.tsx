import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import * as Progress from 'react-native-progress';

export default function App() {

  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula la carga de recursos
    const loadResources = () => {
      let progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 1) {
            clearInterval(progressInterval);
            setIsLoading(false); // Simula que la carga ha terminado
            return 1;
          }
          return prevProgress + 0.1;
        });
      }, 500);
    };

    loadResources();
  }, []);

  return (
    <ImageBackground source={require('./assets/images/Airsoft_BW.png')} style={styles.background}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Progress.Bar progress={progress} width={340} color="#FB6600" />
        </View>
      )}
      <View style={styles.logoContainer}>
        <ImageBackground source={require('./assets/images/logo.png')} style={styles.logo} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Asegura que la imagen de fondo cubra toda la pantalla
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Alinea el logo en la parte inferior
    alignItems: 'center',
    marginBottom: 30, // Ajusta el margen inferior según tus necesidades
  },
  logo: {
    width: 600, // Ajusta el ancho del logo según tus necesidades
    height: 200, // Ajusta la altura del logo según tus necesidades
    resizeMode: 'contain', 
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -170 }, { translateY: 410 }], // Centra la barra de progreso
  },
});
