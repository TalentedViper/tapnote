import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { PaymentRequest, GooglePayButton, GooglePayButtonConstants } from '@google/react-native-make-payment';

import { googlePay } from '../../../redux/actions/authAction';
import { colors, rounded, typography } from '../../../styles';

const left_arrow = require('../../../assets/images/left-arrow.png');
const image = require('../../../assets/images/sub-img.png');
const dollar_icon = require('../../../assets/images/dollar.png');


type NavigationProps = {
  navigation: StackNavigationProp<any, 'Subscription'>;
};

const card_data = [
  {
    number: '1',
    period: 'Monthly',
    price: '0.01',
  },
  {
    number: '1',
    period: 'Yearly',
    price: '5.99',
  },
  {
    number: '12',
    period: 'Yearly',
    price: '50.0',
  },
];

const Subscription: React.FC<NavigationProps> = ({ navigation }) => {

  const dispatch = useDispatch();

  const [selected, setSeleted] = useState(1);
  const [payAmount, setPayAmount] = useState('');

  const [text, setText] = React.useState('React Native demo');

  const goBack = () => {
    navigation.navigate('Setting');
  };

  const selectPayment = (item: any, num: number) => {
    setPayAmount(item.price);
    setSeleted(num);

  };

  const paymentDetails = {
    total: {
      amount: {
        currency: 'USD',
        value: payAmount.toString(),
      },
    },
  };

  const googlePayRequest = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
      {
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: [
            'AMEX',
            'DISCOVER',
            'INTERAC',
            'JCB',
            'MASTERCARD',
            'VISA',
          ],
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: {
            gateway: 'stripe',
            gatewayMerchantId: '<PSP merchant ID>',
          },
        },
      },
    ],
    merchantInfo: {
      merchantId: '01234567890123456789',
      merchantName: 'Example Merchant',
    },
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPrice: paymentDetails.total.amount.value,
      currencyCode: paymentDetails.total.amount.currency,
      countryCode: 'US',
    },
  };

  const paymentMethods = [
    {
      supportedMethods: 'google_pay',
      data: googlePayRequest,
    },
  ];

  const paymentRequest = new PaymentRequest(paymentMethods, paymentDetails);

  const handleResponse = async (response: any) => {
    setText(response);
    console.log(response);
  }

  const checkCanMakePayment = async () => {
    paymentRequest
      .canMakePayment()
      .then((canMakePayment: any) => {
        if (canMakePayment) {
          showPaymentForm();
        } else {
          handleResponse('Google Pay unavailable');
        }
      })
      .catch((error: any) => {
        handleResponse(`paymentRequest.canMakePayment() error: ${error}`);
      });
  }

  const showPaymentForm = async () => {
    paymentRequest
      .show()
      .then((response: any) => {
        if (response === null) {
          handleResponse('Payment sheet cancelled');
        } else {
          handleResponse(JSON.stringify(response, null, 2));
          // console.log("xxx", response.paymentMethodData.token);
          (dispatch as any)(googlePay((response.paymentMethodData.token), selected, parseFloat(payAmount) / 100))
        }
      })
      .catch((error: any) => {
        handleResponse(`paymentRequest.show() error: ${error}`);
      });
  }

  return (
    <View style={styles.container}>
      <View style={styles.title_part}>
        <TouchableOpacity
          onPress={goBack}
          style={styles.go_back}>
          <Image source={left_arrow} />
        </TouchableOpacity>
        <Text style={[styles.page_title, typography.h3, { color: colors.bandingblack }]}>Subscription</Text>
        <Text style={styles.heddin_text}>text</Text>
      </View>
      <ScrollView>
        <View style={styles.image_art}>
          <Image source={image} style={styles.img} />
        </View>
        <View style={styles.payment_part}>
          <Text style={[styles.payment_title, typography.boldH1]}>Get PreMium</Text>
          <Text style={[styles.payment_des, typography.h2]}>Get All The New Exciting Features</Text>
        </View>
        <View style={styles.card_group}>
          {card_data && card_data.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                style={selected === index ? [styles.card, styles.margin_vertical] : styles.card}
                onPress={() => selectPayment(item, index)}
              >
                <View
                  style={index === 1 ? styles.top_part : [styles.top_part, { opacity: 0 }]}
                >
                  <Text style={[styles.pay_regular, { color: colors.white }]}>Most Popular</Text>
                </View>
                <View
                  style={selected === index ? [styles.middle_part, styles.border_none] : [styles.middle_part, styles.border_color]}
                >
                  <Text style={styles.number}>{item.number}</Text>
                  <Text style={styles.use_priod}>{item.period}</Text>
                </View>
                <View style={styles.bottom_part}>
                  <Image source={dollar_icon} />
                  <Text style={styles.price}>{item.price}</Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
        {/* <View style={styles.payment_btn_wraper}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={payment}
            style={[styles.payment_button, { backgroundColor: '#1D5C77' }]}
          >
            <Text style={[typography.h4, styles.btn_text]}>Proceed to Payment</Text>
          </TouchableOpacity>
        </View> */}
        <GooglePayButton
          style={styles.googlepaybutton}
          onPress={checkCanMakePayment}
          allowedPaymentMethods={googlePayRequest.allowedPaymentMethods}
          theme={GooglePayButtonConstants.Themes.Light}
          corners={10}
          type={GooglePayButtonConstants.Types.Buy}
          radius={50}
        />
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    backgroundColor: colors.background,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  googlepaybutton: {
    height: 100,
    marginTop: 30,
    marginHorizontal: 45,
    fontFamily:'Poppins'
  },
  title_part: {
    flexDirection: 'row',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 25,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transcription',
  },
  go_back: {
    width: 22,
    height: 12,
    left: 0,
  },
  page_title: {
    fontWeight: 'bold',
    alignSelf: 'center',
    color: colors.black,
  },
  heddin_text: {
    width: 22,
    opacity: 0,
  },
  image_art: {
    marginTop: -15,
    marginBottom: 10,
  },
  img: {
    alignSelf: 'center',
  },
  payment_part: {
    paddingHorizontal: 13,
  },
  payment_title: {
    alignSelf: 'center',
    marginBottom: 6,
    fontWeight: 'bold',
    color: colors.bandingblack,
  },
  payment_des: {
    alignSelf: 'center',
    color: '#2B2B2B',
    marginBottom: 44,
  },
  card_group: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 0,
  },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#2B2B2B',
    width: 120,
    overflow: 'hidden',
  },
  top_part: {
    backgroundColor: '#00AD00',
    paddingVertical: 10,
  },
  pay_regular: {
    alignSelf: 'center',
  },
  middle_part: {
    paddingTop: 5,
    paddingBottom: 12,
    borderBottomWidth: 3,
  },
  number: {
    fontSize: 40,
    alignSelf: 'center',
    fontWeight: 'bold',
    color: '#2B2B2B',
    fontFamily: 'Poppins',
    lineHeight: 45,
  },
  use_priod: {
    alignSelf: 'center',
    color: '#2B2B2B',
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
  },
  bottom_part: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 9,
    paddingTop: 5,
    gap: 9,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    color: '#2B2B2B',
  },
  margin_vertical: {
    marginTop: -20,
    marginBottom: 20,
  },
  border_color: {
    borderBottomColor: '#2B2B2B',
  },
  border_none: {
    borderBottomColor: 'transparent',
  },
  payment_btn_wraper: {
    marginTop: 29,
    marginBottom: 50,
    paddingHorizontal: 44,
  },
  payment_button: {
    width: '100%',
    paddingVertical: 8,
    borderRadius: rounded.xl,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
      },
      android: {
        shadowColor: colors.black,
        shadowOffset: { width: 5, height: 3 },
        shadowRadius: 3,
        elevation: 3,
      },
    }),
  },
  btn_text: {
    alignSelf: 'center',
    color: 'white',
  }
});

export default Subscription;
