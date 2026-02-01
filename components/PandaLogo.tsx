import React from 'react';
import Svg, { Path, Circle, G, Ellipse } from 'react-native-svg';

interface PandaLogoProps {
    width?: number;
    height?: number;
    color?: string; // Main color (usually white or black)
}

export default function PandaLogo({ width = 40, height = 40, color = "#fff" }: PandaLogoProps) {
    return (
        <Svg width={width} height={height} viewBox="0 0 100 100">
            <G>
                {/* Ears */}
                <Circle cx="25" cy="25" r="12" fill={color} />
                <Circle cx="75" cy="25" r="12" fill={color} />

                {/* Face Background (White usually, but using custom color handling) */}
                {/* We can make it an outline or solid. Let's make a cute filled face. */}
                <Circle cx="50" cy="55" r="35" fill={color} />

                {/* Eyes (Inverse color basically - simulating transparency or black) */}
                {/* Simplified eye patches */}
                <Ellipse cx="38" cy="50" rx="8" ry="6" fill="#000" />
                <Ellipse cx="62" cy="50" rx="8" ry="6" fill="#000" />

                {/* Pupils */}
                <Circle cx="39" cy="49" r="2" fill="#fff" />
                <Circle cx="61" cy="49" r="2" fill="#fff" />

                {/* Nose */}
                <Ellipse cx="50" cy="62" rx="4" ry="3" fill="#000" />

                {/* Mouth */}
                <Path
                    d="M 45 68 Q 50 72 55 68"
                    stroke="#000"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                />
            </G>
        </Svg>
    );
}
