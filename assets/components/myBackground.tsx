import React from 'react';
import { View, ImageBackground, Dimensions } from 'react-native';
import { globalStyles as gs } from './globalStyles';

interface BackgroundProps {
  children?: React.ReactNode;
}

const { width, height } = Dimensions.get('window');

const Background: React.FC<BackgroundProps> = ({ children }) => {
  return (
    <View style={gs.containerFondo}>
      {/* Imagen superior */}
      <ImageBackground 
        source={require('./assets/shoot-tracker-header.png')} 
        style={gs.imageBackgroundFondo}
        resizeMode="cover"
      />
      
      {/* Fondo negro */}
      <View style={gs.blackBackgroundFondo} />
      
      {/* Contenido de la pantalla */}
      <View style={gs.contentContainerFondo}>
        {children}
      </View>
    </View>
  );
};
export default Background;