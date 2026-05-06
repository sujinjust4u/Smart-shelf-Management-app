import React from 'react';
import { View, StyleSheet } from 'react-native';

const BoundingBoxOverlay = ({ boxes, imageWidth, imageHeight }) => {
    if (!boxes || boxes.length === 0) return null;

    return (
        <View style={StyleSheet.absoluteFill}>
            {boxes.map((box, index) => {
                // Determine CSS equivalent positions based on image original dimensions vs displayed dimensions.
                // For simplicity in React Native Image `resizeMode="contain"`, we assume the container and image match.
                // In a production app, more complex math is needed to map natural resolution to displayed resolution.
                
                // For this example, we assume the backend scales coords to 0-1 or we just draw roughly.
                // Let's assume the backend returned original pixel coordinates.
                // Since `resizeMode='contain'` centers the image, the box overlay needs to handle scaling.
                // For MVP, we will render a border using percentages if available, or just raw pixels if mapped later.
                // To do this simply, we will pass scale factors or just render relative absolute positions.
                
                // Assuming boxes are percentages to make it easy:
                // If not, we could calculate: left: (box.x1 / origWidth) * viewWidth.
                
                const style = {
                    position: 'absolute',
                    borderWidth: 2,
                    borderColor: 'red',
                    // This is a placeholder for actual math:
                    left: `${(box.x1 / imageWidth) * 100}%`,
                    top: `${(box.y1 / imageHeight) * 100}%`,
                    width: `${((box.x2 - box.x1) / imageWidth) * 100}%`,
                    height: `${((box.y2 - box.y1) / imageHeight) * 100}%`,
                };

                return <View key={index} style={style} />;
            })}
        </View>
    );
};

export default BoundingBoxOverlay;
