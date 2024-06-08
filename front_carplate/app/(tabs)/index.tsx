import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import {
	Button,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Modal,
} from "react-native";

export default function App() {
	const [facing, setFacing] = useState("back");
	const [camera, setCamera] = useState(null);
	const [photo, setPhoto] = useState(null);
	const [permission, requestPermission] = useCameraPermissions();
	const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

	if (!permission) {
		return <View />;
	}

	if (!permission.granted) {
		return (
			<View style={styles.container}>
				<Text style={{ textAlign: "center" }}>
					We need your permission to show the camera
				</Text>
				<Button onPress={requestPermission} title='Grant Permission' />
			</View>
		);
	}

	async function takePicture() {
		if (camera) {
			const photo = await camera.takePictureAsync();
			setPhoto(photo);
		}
	}

	async function sendPhotoToAPI() {
		if (photo) {
			console.log(photo);
			// Open modal after taking photo
			setModalVisible(true);
		}
	}

	function toggleCameraFacing() {
		setFacing(facing === "back" ? "front" : "back");
	}

	function deletePhoto() {
		setPhoto(null);
	}

	return (
		<View style={styles.container}>
			{photo ? (
				<View style={{ flex: 1 }}>
					<Image
						source={{ uri: photo.uri }}
						style={{ flex: 1 }}
						resizeMode='cover'
					/>
					<View style={styles.buttonRow}>
						<TouchableOpacity style={styles.deleteButton} onPress={deletePhoto}>
							<Text style={styles.text}>Delete</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.sendButton}
							onPress={sendPhotoToAPI}>
							<Text style={styles.text}>Send Photo</Text>
						</TouchableOpacity>
					</View>
				</View>
			) : (
				<CameraView
					style={styles.camera}
					type={facing}
					ref={ref => setCamera(ref)}>
					<View style={styles.buttonContainer}>
						<TouchableOpacity
							style={styles.button}
							onPress={toggleCameraFacing}></TouchableOpacity>
					</View>
					<TouchableOpacity style={styles.circleButton} onPress={takePicture}>
						<View style={styles.innerCircle} />
					</TouchableOpacity>
				</CameraView>
			)}
			{/* Modal */}
			<Modal
				animationType='slide'
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={styles.modalHeaderText}>KRA57028</Text>
						{/* Tekst zamiast listy */}
						<Text style={styles.modalText}>No comments</Text>
						<TouchableOpacity onPress={() => setModalVisible(false)}>
							<Text style={styles.exitButton}>Exit</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	camera: {
		flex: 1,
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		marginBottom: 20,
	},
	circleButton: {
		position: "absolute",
		bottom: 20,
		right: 150,
		left: 175,
		width: 70,
		height: 70,
		borderRadius: 35,
		backgroundColor: "white",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 15,
	},
	innerCircle: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: "#fff",
	},
	button: {
		alignSelf: "center",
		alignItems: "center",
	},
	deleteButton: {
		backgroundColor: "red",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 5,
		marginBottom: 20,
	},
	sendButton: {
		backgroundColor: "#007AFF",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 5,
		marginBottom: 20,
		marginLeft: 10,
	},
	buttonRow: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 20,
		position: "absolute",
		bottom: 10,
		left: 0,
		right: 0,
	},
	text: {
		fontSize: 18,
		fontWeight: "bold",
		color: "white",
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		backgroundColor: "#fff",
		padding: 20,
		width: 375,
		borderRadius: 10,
		alignItems: "center",
	},
	modalHeaderText: {
		fontSize: 32,
		fontWeight: "bold",
		marginBottom: 10,
	},
	modalText: {
		fontSize: 18,
		marginBottom: 5,
		textAlign: "center", // opcjonalne: do centrowania tekstu
	},
	exitButton: {
		marginTop: 20,
		color: "#FFFFFF",
		fontSize: 24,
		borderRadius: 5,
		fontWeight: "bold",
		backgroundColor: "#FF0000",
		paddingVertical: 5,
		paddingHorizontal: 10,
	},
});
