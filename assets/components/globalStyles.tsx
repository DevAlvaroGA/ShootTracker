// globalStyles.tsx
import { StyleSheet, Dimensions } from 'react-native';
import * as Colors from './colors'; // Asumiendo que tienes este archivo de colores

const { width, height } = Dimensions.get('window');

export const globalStyles = StyleSheet.create({
    //---------------- GENERAL ----------------
    versionText: {
        color: Colors.grisOscuro,
        fontSize: 12,
        textAlign: 'center',
        fontFamily: 'Michroma',
    },
    inputWrapper: {
        marginBottom: 20,
    },
    input: {
        height: 56,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: Colors.naranjaPrincipal, // O Colors.primaryOrange
        borderRadius: 8,
        paddingHorizontal: 20,
        fontSize: 16,
        color: Colors.blanco,
        fontFamily: 'Michroma', // Asegúrate de que la fuente esté correctamente vinculada
    },

    //---------------- IMAGEN DE FONDO (Si usas un enfoque de fondo con dos capas, como se sugiere aquí)
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

    //---------------- SPLASH SCREEN ----------------
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

    //---------------- LOGIN ----------------
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
        color: Colors.naranjaPrincipal, // O Colors.primaryOrange si tienes un archivo de colores
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
    loadingContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    errorContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    errorText: {
        color: Colors.rojoERROR,
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'Michroma',
    },
    LOGIN_Button: {
        backgroundColor: Colors.naranjaPrincipal,
        height: 56,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    LOGIN_ButtonText: {
        color: Colors.negro,
        fontSize: 16,
        fontFamily: 'Michroma',
        alignItems: 'center',
    },
    forgotPasswordContainer: {
        alignItems: 'center',
        marginTop: 26,
    },
    LOGIN_forgotPasswordText: {
        color: Colors.gris,
        fontSize: 15,
        textAlign: 'center',
        marginTop: 4,
        fontFamily: 'Michroma',
    },
    LOGIN_newAccountText: {
        color: '#FF8800',
        fontSize: 15,
        fontFamily: 'Michroma',
    },

    //---------------- REGISTER ----------------
    REGISTER_input: {
        height: 56,
        width: '100%',
        marginBottom: 15,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: Colors.naranjaPrincipal,
        borderRadius: 8,
        paddingHorizontal: 20,
        fontSize: 16,
        color: Colors.blanco,
        fontFamily: 'Michroma', // Asegúrate de que la fuente esté correctamente vinculada
    },
    REGISTER_formContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    REGISTER_Button: {
        backgroundColor: Colors.naranjaPrincipal,
        width: '80%',
        height: 56,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    REGISTER_ButtonText: {
        color: Colors.negro,
        fontSize: 16,
        fontFamily: 'Michroma',
        alignItems: 'center',
    },
    REGISTER_HaveAccountText: {
        color: Colors.gris,
        fontSize: 15,
        textAlign: 'center',
        marginTop: 4,
        fontFamily: 'Michroma',
    },
    REGISTER_titleText: {
        fontSize: 28,
        color: '#FFF',
        fontFamily: 'Michroma',
        textAlign: 'center',
        marginBottom: 20,
    },

    //---------------- FORGOTPASSWORD ----------------
    PASSWORD_input: {
        height: 56,
        width: '80%',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: Colors.naranjaPrincipal,
        borderRadius: 8,
        paddingHorizontal: 20,
        fontSize: 16,
        color: Colors.gris,
        fontFamily: 'Michroma', // Asegúrate de que la fuente esté correctamente vinculada
    },
    PASSWORD_formContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    PASSWORD_titleText: {
        fontSize: 28,
        color: '#FFF',
        fontFamily: 'Michroma',
        textAlign: 'center',
        marginBottom: 20,
    },
    PASSWORD_Button: {
        backgroundColor: Colors.naranjaPrincipal, // O Colors.primaryOrange
        width: '80%',
        height: 56,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    PASSWORD_ButtonText: {
        color: Colors.negro,
        fontSize: 16,
        fontFamily: 'Michroma',
        alignItems: 'center',
    },
    PASSWORD_HomeText: {
        color: Colors.gris,
        fontSize: 15,
        textAlign: 'center',
        marginTop: 4,
        fontFamily: 'Michroma',
    },

    //---------------- NEW GAME ----------------
    containerNG: {
        flex: 1,
    },
    backgroundImageNG: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start', // empezamos un poco más abajo
        alignItems: 'center',
        paddingTop: '20%', // margen superior de 20% para no tapar el banner
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 26,
        color: Colors.naranjaPrincipal,
        marginBottom: 20,
        fontFamily: 'Michroma',
        textAlign: 'center',
    },
    inputNG: {
        width: '90%',
        backgroundColor: 'transparent',
        color: Colors.naranjaPrincipal,
        fontSize: 16,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderColor: Colors.naranjaPrincipal,
        padding: 12,
        marginBottom: 12,
        fontFamily: 'Michroma',
    },
    primaryButton: {
        backgroundColor: Colors.naranjaPrincipal,
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryButtonText: {
        color: Colors.negro,
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        fontFamily: 'Michroma',
    },
    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,
    },

    numberInputContainer: {
        flex: 1,
        marginHorizontal: 5,
    },

    numberInput: {
        backgroundColor: "transparent",
        borderColor: "#FB6600",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 16,
        color: "#FB6600",
    },
    label: {
        color: Colors.gris,
        fontSize: 14,
        fontFamily: 'Michroma',
    },

    //---------------- EXTRAS ----------------
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: Colors.naranjaPrincipal,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    pickerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center", // centra verticalmente los pickers
        marginVertical: 10,
    },
    pickerWrapper: {
        flex: 1,
        backgroundColor: Colors.negro,
        borderRadius: 10,
        marginHorizontal: 3,
        borderWidth: 1,
        borderColor: Colors.naranjaPrincipal,
        justifyContent: "center",
        height: 45, // uniforme
    },
    yearPicker: {
        flex: 1.2, // un poco más ancho para el año
    },
    picker: {
        color: "#fff",
    },


});
