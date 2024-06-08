import { useState } from "react";
import {
	Image,
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function HomeScreen() {
	const [image, setImage] = useState<string | null>(null);
	const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		console.log(result);

		if (!result.canceled && result.assets) {
			setImage(result.assets[0].uri);
		}
	};

	async function sendPickerPhotoToAPI() {
		// Open modal
		setModalVisible(true);

		const postImage = async () => {
			try {
				const formData = new FormData();
				formData.append("image", {
					uri: image,
					type: "image/jpeg",
					name: "photo.jpg",
				});
				const response = await fetch("https://localhost:7009/plate", {
					method: "POST",
					body: formData,
				});
				if (!response.ok) {
					throw new Error("Failed to post image");
				}
				return response;
			} catch (error) {
				console.log("Error sending photo", error);
			} finally {
				// Close modal after request is finished
				setModalVisible(false);
			}
		};
		postImage();
	}

	return (
		<View style={styles.container}>
			{image && <Image source={{ uri: image }} style={styles.image} />}
			<View style={styles.buttons}>
				<TouchableOpacity style={styles.button} onPress={pickImage}>
					<Text style={styles.buttonText}>
						{image ? "Change image" : "Pick an image from camera roll"}
					</Text>
				</TouchableOpacity>
				{image && (
					<TouchableOpacity
						style={styles.buttonSend}
						onPress={sendPickerPhotoToAPI}>
						<Text style={styles.buttonSendText}>Check driver ratings</Text>
					</TouchableOpacity>
				)}
			</View>
			{/* Modal */}
			<Modal
				animationType='slide'
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={styles.modalHeaderText}>EL5GE70</Text>
						{/* Lista */}
						<View style={styles.listContainer}>
							<Text style={styles.listHeader}>Comment list</Text>
							<View style={styles.listItem}>
								<Text style={styles.listItemText}>
									{"> Kolejny zmanipulowany przez telewizor.."}
								</Text>
							</View>
							<View style={styles.listItem}>
								<Text style={styles.listItemText}>{"> Nie hejtuję."}</Text>
							</View>
							<View style={styles.listItem}>
								<Text style={styles.listItemText}>{"> Zjeb z elektryka"}</Text>
							</View>
							<View style={styles.listItem}>
								<Text style={styles.listItemText}>
									{
										"> równie dobrze mógłby rowerem albo hulajnoga usiłować wjechać"
									}
								</Text>
							</View>
							<View style={styles.listItem}>
								<Text style={styles.listItemText}>{"> Dzban"}</Text>
							</View>
						</View>
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
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#151819",
	},
	buttons: {
		display: "flex",
		flexDirection: "row",
		gap: 40,
	},
	button: {
		backgroundColor: "#007AFF",
		padding: 10,
		borderRadius: 15,
		alignItems: "center",
	},
	buttonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
	buttonSend: {
		backgroundColor: "#FFFFFF",
		padding: 10,
		borderRadius: 15,
		alignItems: "center",
	},
	buttonSendText: {
		color: "#007AFF",
		fontSize: 18,
		fontWeight: "bold",
	},
	image: {
		width: 375,
		height: 375,
		borderRadius: 20,
		marginBottom: 50,
		marginTop: 150,
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
	},
	listContainer: {
		marginTop: 20,
	},
	listHeader: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 10,
		color: "#007AFF",
	},
	listItem: {
		paddingVertical: 5,
	},
	listItemText: {
		fontSize: 16,
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
