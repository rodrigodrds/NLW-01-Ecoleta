import React, { useEffect, useState } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Image, StyleSheet, Text, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import ibgeAPI from '../../services/ibge';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECidadeResponse {
  nome: string;
}

interface ItemPicker {
  label: string;
  value: string;
}

const Home = () => {
  const navigation = useNavigation();

  function handleNavigateToPoinst() {
    if (selectedUf === '0' || selectedCity === '0') {
      Alert.alert('Você deve selecionar Estado (UF) e uma Cidade.')
      return;
    }
    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity,
    });
  }

  const [ufs, setUf] = useState<ItemPicker[]>([]);
  const [cities, setCities] = useState<ItemPicker[]>([]);
  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  useEffect(() => {
    ibgeAPI.get<IBGEUFResponse[]>('estados')
      .then(response => {
        const ufsItems = response.data
        .map(uf => uf.sigla)
        .sort()
        .map(uf => {
          return { label: uf, value: uf }
        });

        setUf(ufsItems);
      })
  }, [])

  useEffect(() => {
    if (selectedUf === '0') {
      return;
    }
    ibgeAPI.get<IBGECidadeResponse[]>(`estados/${selectedUf}/municipios`)
      .then(response => {
        const citiesItem = response.data.map(city => {
          return { label: city.nome, value: city.nome }
        });

        setCities(citiesItem);
      })
  }, [selectedUf])

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        source={require('../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>
              Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <RNPickerSelect
            style={{
              inputIOS: styles.input,
              inputAndroid: styles.input,
              iconContainer: {
                top: 20,
                right: 12,
              }
            }}
            placeholder={{ label: 'Selecione Estado (UF)' }}
            onValueChange={(value) => setSelectedUf(value)}
            items={ufs}
            Icon={() => <Icon name='chevron-down' size={16} color='#A0A0B2' />}
          />
          <RNPickerSelect
            style={{
              inputIOS: styles.input,
              inputAndroid: styles.input,
              iconContainer: {
                top: 24,
                right: 15,
              }
            }}
            placeholder={{ label: 'Selecione Cidade' }}
            onValueChange={(value) => setSelectedCity(value)}
            items={cities}
            Icon={() => <Icon name='chevron-down' size={16} color='#A0A0B2' />}
          />
          <RectButton style={styles.button} onPress={handleNavigateToPoinst}>
            <View style={styles.buttonIcon}>
              <Icon name="arrow-right" color="#fff" size={20} />
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;