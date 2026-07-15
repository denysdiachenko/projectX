import {View} from "react-native";
import {Image} from "expo-image";
import createStyles from "@/components/WelcomeHero/styles";
import {useAppTheme} from "@/hooks/app-theme";

const WelcomeHero = ()=>
{
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.hero}>
      <View pointerEvents="none" style={styles.heroArt}>
        <View style={[styles.decorBar, styles.yellowBar]}/>
        <View style={[styles.decorOrb, styles.violetOrb]}/>
        <View style={[styles.decorOrb, styles.coralOrb]}/>
        <View style={[styles.decorBar, styles.mintBar]}/>
        <View style={[styles.confetti, styles.confettiOne]}/>
        <View style={[styles.confetti, styles.confettiTwo]}/>
        <View style={[styles.confetti, styles.confettiThree]}/>
        <View style={styles.ringOuter}/>
        <View style={styles.ringInner}/>
        <View style={styles.iconHalo}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.heroIcon}
            contentFit="cover"
            transition={150}
          />
        </View>
      </View>
    </View>
  );
}

export default WelcomeHero;
