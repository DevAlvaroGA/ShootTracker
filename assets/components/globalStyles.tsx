// globalStyles.tsx
import { StyleSheet, Dimensions } from 'react-native';
import * as Colors from './colors'; // Asumiendo que tienes este archivo de colores

const { width, height } = Dimensions.get('window');

export const globalStyles = StyleSheet.create({
    //---------------- GENERAL ----------------
    container: {
        flex: 1,
        backgroundColor: "#000",
        fontFamily: "Michroma",
    },
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
    LOGIN_input: {
        height: 56,
        backgroundColor: 'transparent',
        marginBottom: 15,
        borderWidth: 2,
        borderColor: Colors.naranjaPrincipal, // O Colors.primaryOrange
        borderRadius: 8,
        paddingHorizontal: 20,
        fontSize: 16,
        color: Colors.blanco,
        fontFamily: 'Michroma', // Asegúrate de que la fuente esté correctamente vinculada
    },
    // ---------------- LOGIN - NEW STYLES ----------------

    LOGIN_googleButton: {
        backgroundColor: "#ffffff",
        height: 56,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#ddd",
    },

    LOGIN_googleContent: {
        flexDirection: "row",
        alignItems: "center",
    },

    LOGIN_googleIcon: {
        width: 24,
        height: 24,
        marginRight: 12,
        backgroundColor: "#fff",
        borderRadius: 4,
        //backgroundImage: "url('../images/google_icon.png')", // si usas ícono externo cámbialo a <Image>
    },

    LOGIN_googleText: {
        fontSize: 16,
        color: "#000",
        fontFamily: "Michroma",
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
    // ---------- HOME ----------
    HM_header: {
        width: "100%",
        paddingTop: 10,
        paddingLeft: 10,
        position: "absolute",
        zIndex: 20,
    },

    HM_logo: {
        width: 150,
        height: 150,
    },

    HM_title: {
        color: Colors.naranjaPrincipal,
        fontSize: 22,
        fontFamily: "Michroma",
        marginBottom: 15,
        textAlign: "center",
    },

    HM_chart: {
        borderRadius: 16,
        marginBottom: 20,
    },

    HM_noData: {
        color: Colors.naranjaPrincipal,
        fontSize: 16,
        fontFamily: "Michroma",
        marginVertical: 30,
        textAlign: "center",
    },

    HM_subtitle: {
        color: Colors.naranjaPrincipal,
        fontSize: 20,
        fontFamily: "Michroma",
        marginBottom: 10,
        textAlign: "center",
    },

    HM_table: {
        width: "100%",
        marginBottom: 30,
        borderWidth: 1,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#555",
    },

    HM_tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#555",
        paddingVertical: 5,
        paddingHorizontal: 3,
    },

    HM_tableHeader: {
        backgroundColor: "#303030ff",
    },

    HM_tableCell: {
        color: "#fff",
        fontSize: 10,
        fontFamily: "Michroma",
        textAlign: "center",
    },

    HM_floatingButton: {
        position: "absolute",
        bottom: 25,
        right: 25,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.naranjaPrincipal,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 50,
    },
    HM_sideMenu: {
        position: "absolute",
        top: 0,
        bottom: 0,
        width: 250,
        backgroundColor: "#1b1b1b",
        zIndex: 100,
        paddingTop: 50,
        paddingHorizontal: 10,
    },

    HM_menuOverlay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 50,
    },

    HM_menuHeader: {
        alignItems: "center",
        marginBottom: 20,
    },

    HM_menuProfilePic: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },

    HM_menuUsername: {
        color: "#FFA500",
        fontFamily: "Michroma",
        fontSize: 18,
    },
    HM_menuContainer: {
        position: "absolute",
        top: 0,
        left: -250,
        width: 250,
        height: "100%",
        backgroundColor: "#1b1b1b",
        paddingTop: 60,
        paddingHorizontal: 20,
        zIndex: 60,
        borderBottomEndRadius: 20,
    },
    HM_menuProfile: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 30,
        alignSelf: "center",
    },
    HM_menuItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    HM_menuText: {
        color: Colors.naranjaPrincipal,
        fontFamily: "Michroma",
        fontSize: 18,
        marginLeft: 15,
    },
    HM_headerBar: {
        position: "absolute",
        top: 20,
        left: 0,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        zIndex: 100,
    },

    HM_menuButton: {
        padding: 15, // hitbox grande
        borderRadius: 12,
    },

    HM_headerLogo: {
        width: 140,
        height: 140,
    },
    HM_headerLeft: {
        width: 60,  // mantiene el espacio del botón SIEMPRE
        height: 60,
        justifyContent: "center",
        alignItems: "flex-start",
    },

    HM_headerRight: {
        justifyContent: "center",
        alignItems: "flex-end",
        flex: 1,
    },
    // ---------- NEW GAME ----------
    NW_container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
    },
    NW_title: {
        fontSize: 30,
        color: '#FB6600',
        marginVertical: 20,
        fontFamily: 'Michroma',
        textAlign: 'center',
    },
    NW_input: {
        width: '100%',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        fontSize: 18,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#FB6600',
        fontFamily: 'Michroma',
    },
    NW_label: {
        color: '#fff',
        marginBottom: 5,
        fontFamily: 'Michroma',
        fontSize: 16,
    },
    NW_pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    NW_picker: {
        flex: 1,
        color: '#fff',
        backgroundColor: '#1a1a1a',
        marginHorizontal: 2,
        borderRadius: 10,
    },
    NW_dropdown: {
        backgroundColor: '#1a1a1a',
        borderColor: '#FB6600',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 15,
    },
    NW_dropdownContainer: {
        backgroundColor: '#1a1a1a',
        borderColor: '#FB6600',
        borderWidth: 1,
    },
    NW_dropdownText: {
        color: '#fff',
        fontFamily: 'Michroma',
        fontSize: 16,
    },
    NW_rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    NW_numberInputContainer: {
        flex: 1,
        marginHorizontal: 5,
    },
    NW_smallLabel: {
        color: '#fff',
        fontFamily: 'Michroma',
        marginBottom: 5,
        fontSize: 14,
    },
    NW_numberInput: {
        backgroundColor: '#1a1a1a',
        color: '#fff',
        fontSize: 16,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FB6600',
    },
    NW_primaryButton: {
        backgroundColor: Colors.naranjaPrincipal,
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    NW_primaryButtonText: {
        color: Colors.negro,
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        fontFamily: 'Michroma',
    },
    NW_logoutText: {
        color: "#000",
        fontFamily: "Michroma",
        fontSize: 14,
        fontWeight: "bold",
    },
    NW_logoutButton: {
        position: "absolute",
        top: 15,
        right: 15,
        backgroundColor: "#FFA500",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        zIndex: 999,
        flexDirection: "row",
        alignItems: "center",
    },


    // ERRORES (para mensajes locales o Toast)
    NW_ER_text: {
        color: 'red',
        marginBottom: 10,
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
    // ---------- HISTORY SCREEN ----------
    HST_container: {
        flex: 1,
        backgroundColor: "#000",
        paddingTop: 30,
        paddingHorizontal: 12,
    },

    HST_title: {
        color: "#FFA500",
        fontFamily: "Michroma",
        fontSize: 22,
        textAlign: "center",
        marginBottom: 15,
    },

    HST_loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    // ---------- SORTING ----------
    HST_sortBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
    },

    HST_pickerWrapper: {
        backgroundColor: "#222",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#444",
        width: 170,
        height: 40,
        justifyContent: "center",
        marginRight: 10,
    },

    HST_picker: {
        color: "#FFA500",
        fontSize: 14,
        height: 70,
        paddingLeft: 8,
        fontFamily: "Michroma"
    },


    HST_sortButton: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: "#222",
        borderWidth: 1,
        borderColor: "#444",
        justifyContent: "center",
        alignItems: "center",
    },

    // ---------- CARDS ----------
    HST_card: {
        backgroundColor: "#111",
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#333",
    },

    HST_cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },

    HST_cardDate: {
        color: "#FFA500",
        fontFamily: "Michroma",
        fontSize: 12,
    },

    HST_cardField: {
        color: "#fff",
        fontFamily: "Michroma",
        fontSize: 12,
        textAlign: "right",
        flexShrink: 1,
    },

    HST_cardMode: {
        color: "#ccc",
        fontFamily: "Michroma",
        fontSize: 11,
        marginBottom: 4,
    },

    HST_cardWeapons: {
        color: "#ccc",
        fontFamily: "Michroma",
        fontSize: 11,
        marginBottom: 4,
    },

    HST_cardStats: {
        color: "#ccc",
        fontFamily: "Michroma",
        fontSize: 11,
        marginBottom: 8,
    },

    HST_highlight: {
        color: "#FFA500",
    },

    HST_cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    HST_result: {
        fontFamily: "Michroma",
        fontSize: 12,
    },
    HST_win: { color: "#4CAF50" },
    HST_lose: { color: "#FF5252" },

    HST_points: {
        color: "#FFA500",
        fontFamily: "Michroma",
        fontSize: 12,
    },
    // ---------- PROFILE SCREEN ----------

    PRF_container: {
        flex: 1,
        backgroundColor: "#000",
        paddingHorizontal: 20,
    },

    PRF_loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
    },

    PRF_centered: {
        alignItems: "center",
        marginTop: 20,
    },

    PRF_profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
    },

    PRF_username: {
        color: "#FFA500",
        fontFamily: "Michroma",
        fontSize: 22,
        marginBottom: 10,
    },

    PRF_editButton: {
        backgroundColor: "#FFA500",
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 10,
        marginTop: 5,
    },

    PRF_editButtonText: {
        fontFamily: "Michroma",
        color: "#000",
        fontSize: 14,
    },

    // ---------- INFO CARD ----------

    PRF_infoCard: {
        backgroundColor: "#111",
        borderRadius: 12,
        padding: 15,
        marginTop: 20,
        borderWidth: 1,
        borderColor: "#333",
    },

    PRF_infoLabel: {
        color: "#FFA500",
        fontFamily: "Michroma",
        fontSize: 14,
        marginTop: 12,
    },

    PRF_infoValue: {
        color: "#fff",
        fontFamily: "Michroma",
        fontSize: 13,
        marginTop: 4,
    },

    PRF_bioInput: {
        backgroundColor: "#222",
        color: "#fff",
        padding: 10,
        borderRadius: 8,
        marginTop: 5,
        minHeight: 70,
        textAlignVertical: "top",
        fontFamily: "Michroma",
    },

    // PICKERS
    PRF_pickerWrapper: {
        backgroundColor: "#222",
        borderWidth: 1,
        borderColor: "#444",
        borderRadius: 8,
        marginTop: 5,
    },

    PRF_picker: {
        color: "#FFA500",
        height: 40,
        paddingLeft: 5,
    },

    // ---------- STATS CARD ----------
    PRF_statsCard: {
        backgroundColor: "#111",
        borderRadius: 12,
        padding: 15,
        marginTop: 20,
        borderWidth: 1,
        borderColor: "#333",
    },

    PRF_statsText: {
        color: "#fff",
        fontFamily: "Michroma",
        fontSize: 14,
        marginBottom: 8,
    },

    // ---------- SAVE / CANCEL ----------
    PRF_buttonsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 25,
        marginBottom: 30,
    },

    PRF_saveButton: {
        flex: 1,
        backgroundColor: "#FFA500",
        paddingVertical: 10,
        borderRadius: 10,
        marginRight: 10,
        alignItems: "center",
    },
    PRF_saveButtonText: {
        fontFamily: "Michroma",
        fontSize: 15,
        color: "#000",
    },

    PRF_cancelButton: {
        flex: 1,
        backgroundColor: "#333",
        paddingVertical: 10,
        borderRadius: 10,
        marginLeft: 10,
        alignItems: "center",
    },
    PRF_cancelButtonText: {
        fontFamily: "Michroma",
        fontSize: 15,
        color: "#fff",
    },
    PRF_usernameInput: {
        color: "#FFA500",
        fontFamily: "Michroma",
        fontSize: 22,
        borderBottomWidth: 1,
        borderColor: "#FFA500",
        paddingVertical: 4,
        width: 200,
        textAlign: "center",
        marginBottom: 10,
    },
    // ---------------- VERIFY EMAIL SCREEN ----------------
    verify_container: {
        flex: 1,
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },

    verify_title: {
        color: "#FFA500",
        fontSize: 26,
        fontFamily: "Michroma",
        marginBottom: 20,
        textAlign: "center",
    },

    verify_text: {
        color: "#ccc",
        fontSize: 14,
        fontFamily: "Michroma",
        textAlign: "center",
        marginTop: 10,
    },

    verify_email: {
        color: "#fff",
        fontSize: 18,
        fontFamily: "Michroma",
        marginVertical: 15,
    },

    verify_button: {
        marginTop: 30,
        backgroundColor: "#FFA500",
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 10,
    },

    verify_buttonText: {
        color: "#000",
        fontWeight: "bold",
        fontSize: 16,
        fontFamily: "Michroma",
    },

    verify_backButton: {
        marginTop: 25,
    },

    verify_backText: {
        color: "#FFA500",
        fontSize: 14,
        fontFamily: "Michroma",
    },


});
