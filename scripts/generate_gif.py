import os
import math
from PIL import Image, ImageDraw

def create_courier_drone_gif():
    os.makedirs('public/animations', exist_ok=True)
    frames = []
    width, height = 120, 120
    num_frames = 24

    for f in range(num_frames):
        # Create transparent frame
        im = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(im)

        t = f / num_frames
        bob = math.sin(t * 2 * math.pi) * 4

        center_x = width // 2
        center_y = int(height // 2 + bob)

        # Glow / shadow underneath
        shadow_y = height - 16
        shadow_w = int(24 + math.cos(t * 2 * math.pi) * 3)
        draw.ellipse([center_x - shadow_w, shadow_y - 4, center_x + shadow_w, shadow_y + 4], fill=(79, 70, 229, 45))

        # Drone / Parcel Body (Stylized courier cube with rounded corners)
        box_w, box_h = 44, 38
        bx1 = center_x - box_w // 2
        by1 = center_y - box_h // 2
        bx2 = center_x + box_w // 2
        by2 = center_y + box_h // 2

        # Main parcel box (Indigo & Amber branding)
        draw.rounded_rectangle([bx1, by1, bx2, by2], radius=10, fill=(79, 70, 229, 255), outline=(129, 140, 248, 255), width=2)
        
        # Tape / Ribbon across parcel
        draw.rectangle([center_x - 5, by1, center_x + 5, by2], fill=(245, 158, 11, 230))
        draw.rectangle([bx1, center_y - 4, bx2, center_y + 4], fill=(245, 158, 11, 230))

        # High-tech visor / eyes screen on the parcel
        screen_x1, screen_y1 = center_x - 14, center_y - 12
        screen_x2, screen_y2 = center_x + 14, center_y + 4
        draw.rounded_rectangle([screen_x1, screen_y1, screen_x2, screen_y2], radius=6, fill=(15, 23, 42, 255), outline=(56, 189, 248, 200), width=1)

        # Animated blinking or scanning eyes
        blink = (f in [10, 11, 12])
        if not blink:
            # Two expressive cyan LED eyes
            draw.ellipse([screen_x1 + 4, screen_y1 + 4, screen_x1 + 10, screen_y1 + 11], fill=(56, 189, 248, 255))
            draw.ellipse([screen_x2 - 10, screen_y1 + 4, screen_x2 - 4, screen_y1 + 11], fill=(56, 189, 248, 255))
            # Pupil glint
            draw.point((screen_x1 + 6, screen_y1 + 6), fill=(255, 255, 255, 255))
            draw.point((screen_x2 - 8, screen_y1 + 6), fill=(255, 255, 255, 255))
        else:
            # Closed blink slit
            draw.line([screen_x1 + 4, screen_y1 + 8, screen_x1 + 10, screen_y1 + 8], fill=(56, 189, 248, 255), width=2)
            draw.line([screen_x2 - 10, screen_y1 + 8, screen_x2 - 4, screen_y1 + 8], fill=(56, 189, 248, 255), width=2)

        # Rotor Arms
        # Top Left Arm & Rotor
        rotor_phase = (f * 60) % 360
        rx_offset = int(math.cos(math.radians(rotor_phase)) * 14)

        # Left rotor arm
        draw.line([bx1 + 2, by1 + 4, bx1 - 12, by1 - 10], fill=(148, 163, 184, 255), width=3)
        # Right rotor arm
        draw.line([bx2 - 2, by1 + 4, bx2 + 12, by1 - 10], fill=(148, 163, 184, 255), width=3)

        # Spinning rotor blades (spinning animation)
        draw.line([bx1 - 12 - rx_offset, by1 - 11, bx1 - 12 + rx_offset, by1 - 11], fill=(226, 232, 240, 240), width=2)
        draw.ellipse([bx1 - 14, by1 - 13, bx1 - 10, by1 - 9], fill=(71, 85, 105, 255))

        draw.line([bx2 + 12 - rx_offset, by1 - 11, bx2 + 12 + rx_offset, by1 - 11], fill=(226, 232, 240, 240), width=2)
        draw.ellipse([bx2 + 10, by1 - 13, bx2 + 14, by1 - 9], fill=(71, 85, 105, 255))

        # Pulsing thruster light at bottom
        thruster_color = (244, 63, 94, int(180 + math.sin(t * 4 * math.pi) * 70))
        draw.ellipse([center_x - 4, by2 - 2, center_x + 4, by2 + 4], fill=thruster_color)

        frames.append(im)

    # Save as animated transparent GIF
    gif_path = 'public/animations/courier-drone.gif'
    frames[0].save(
        gif_path,
        save_all=True,
        append_images=frames[1:],
        duration=45,
        loop=0,
        disposal=2,
        transparency=0
    )
    print(f"Generated GIF at {gif_path}")

if __name__ == '__main__':
    create_courier_drone_gif()
