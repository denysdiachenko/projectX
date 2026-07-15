import {Pressable, Text} from "react-native";
import {useAppTheme} from "@/hooks/app-theme";
import createStyles from "@/components/WelcomeButton/styles";

type WelcomeButtonProps = {
  label: string;
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
  onPress: () => void;
};

const WelcomeButton = ({
  label,
  variant = 'secondary',
  icon,
  onPress,
}: WelcomeButtonProps) => {
  const theme = useAppTheme();
  const primary = variant === 'primary';
  const darkAppleButton = icon === 'apple' && theme.name === 'dark';
  const styles = createStyles(theme);


  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({pressed}) => [
        styles.button,
        primary ? styles.primaryButton : styles.secondaryButton,
        darkAppleButton && styles.darkAppleButton,
        pressed && styles.buttonPressed,
      ]}>
      {icon}
      <Text style={[styles.buttonLabel, primary && styles.primaryButtonLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default WelcomeButton;
