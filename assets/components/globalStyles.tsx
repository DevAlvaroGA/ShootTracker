// globalStyles.tsx
import { StyleSheet, Dimensions } from 'react-native';
import * as Colors from './colors'; // Asumiendo que tienes este archivo de colores

const { width, height } = Dimensions.get('window');

export const globalStyles = StyleSheet.create({
    //IMAGEN DE FONDO (Si usas un enfoque de fondo con dos capas, como se sugiere aquí)
    containerFondo: {
        flex: 1,
    },
    imageBackgroundFondo: {
        width: width,
        height: height * 0.4, // La imagen ocupa el 40% superior de la pantalla
        position: 'absolute',
        top: 0,
        left: 0,
    },
    blackBackgroundFondo: {
        width: width,
        height: height * 0.6, // El fondo negro ocupa el 60% inferior
        backgroundColor: '#000000',
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    contentContainerFondo: {
        flex: 1,
        zIndex: 1, // Asegura que el contenido esté por encima del fondo
    },
    //SPLASH SCREEN
    containerSplash: {
        flex: 1,
    },
    backgroundSplash: {
        flex: 1,
        resizeMode: 'cover',
    },
    logoContainerSplash: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 30,
    },
    logoSplash: {
        width: 600,
        height: 200,
        resizeMode: 'contain',
    },
    loadingContainerSplash: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -170 }, { translateY: 410 }],
    },

    //LOGIN
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        // Eliminadas las propiedades de layout de aquí.
        // La ImageBackground solo necesita flex: 1 para ocupar el espacio.
        // El resizeMode se aplica directamente en el componente ImageBackground en el JSX.
    },
    gradient: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 32, // Mantengo 32 de tu estilo 'content' original
        paddingTop: 120, // Aumentado para mover el contenido hacia abajo y exponer más fondo
        paddingBottom: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    logoText: { // Asegúrate de que este estilo exista si planeas usar el logo
        fontSize: 42,
        fontWeight: 'bold',
        color: '#FFA500', // O Colors.primaryOrange si tienes un archivo de colores
        textAlign: 'center',
        letterSpacing: 3,
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingVertical: 40,
    },
    inputWrapper: {
        marginBottom: 20,
    },
    input: {
        height: 56,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#FF8800', // O Colors.primaryOrange
        borderRadius: 8,
        paddingHorizontal: 20,
        fontSize: 16,
        color: '#FFFFFF',
    },
    loadingContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    errorContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    errorText: {
        color: '#FF4444',
        fontSize: 14,
        textAlign: 'center',
    },
    loginButton: {
        backgroundColor: '#FF8800', // O Colors.primaryOrange
        height: 56,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    loginButtonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    forgotPasswordContainer: {
        alignItems: 'center',
        marginTop: 24,
    },
    forgotPasswordText: {
        color: '#CCCCCC',
        fontSize: 14,
        textAlign: 'center',
    },
    highlightText: {
        color: '#FF8800', // O Colors.primaryOrange
        fontWeight: 'bold',
    },
    createAccountButton: {
        alignItems: 'center',
        marginBottom: 20,
    },
    createAccountText: {
        color: '#FF8800', // O Colors.primaryOrange
        fontSize: 16,
        fontWeight: 'bold',
    },
    versionText: {
        color: '#888888',
        fontSize: 12,
        textAlign: 'center',
    },
});
