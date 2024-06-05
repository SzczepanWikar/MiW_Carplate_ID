import { useState } from "react";
import { Image, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function HomeScreen() {
	const [image, setImage] = useState<string | null>(null);

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
		if (image) {
			console.log(image);
		}
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
});
