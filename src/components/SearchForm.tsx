import React, { useState } from 'react';
import {View, StyleSheet, TextInput } from 'react-native';

import {colors, rounded} from '../styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

interface SearchFormProps {
  placeholder: string;
  onSearch: (term: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({placeholder, onSearch }) => {

  const [inputValue, setInputValue] = useState<string>('');

  const handleChange = (value: string) => {
    setInputValue(value);
    onSearch(value);
  };

  return (
    <View style={styles.search_form}>
      <FontAwesomeIcon  icon={faMagnifyingGlass} size={17} color={colors.gray} />
      <TextInput
        style={styles.search_input}
        value={inputValue}
        onChangeText={handleChange}
        placeholderTextColor={colors.gray}
        placeholder={placeholder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  search_form: {
    flexDirection: 'row',
    flexWrap:'wrap',
    justifyContent:'flex-start',
    alignItems:'center',
    paddingHorizontal:14,
    paddingVertical:0,
    backgroundColor:colors.white,
    borderRadius:rounded.xl,
    borderColor:'#666666',
    borderWidth:0.5,
    marginBottom:7,
  },
  search_icon: {
    width:19,
    height:19,
    marginRight:5,
  },
  search_input: {
    flex: 1,
    fontFamily:'Poppins-Regular',
    fontWeight:'400',
    fontSize:18,
    lineHeight:27,
  },
});

export default SearchForm;
