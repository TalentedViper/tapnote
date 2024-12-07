import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity, StatusBar, TouchableWithoutFeedback } from 'react-native';
import { RootState } from '../../redux/reducers';
import { modalHide , setShare} from '../../redux/actions/filterModalActions';
import { getFilterRecording, getFilterShareRecording } from '../../redux/actions/home/homeAction';


import { colors, commonStyles, typography } from '../../styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

const filter_icon = require('../../assets/images/filter.png');

const period = [
    {
        type: 'Yesterday',
        value: 'yesterday',
    }, {
        type: 'Last 7 Days',
        value: 'last_month',
    }, {
        type: 'Last Month',
        value: 'last_7_days'
    }
]

const FilterModal: React.FC = () => {
    const dispatch = useDispatch();
    const isVisible = useSelector((state: RootState) => state.filterModal.modalVisible);
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [sortType, setSortType] = useState<'asc' | 'desc'>('asc');
    const [isShare, setIsShare] = useState(false);

    useEffect(() => {
        filterReset();
    }, [isVisible]);

    const filterReset = () => {
        setSelectedPeriod('');
        setSortType('asc');
        setIsShare(false);
    }

    const handleSort = (type: 'asc' | 'desc') => {
        setSortType(type);
    };

    const handlePress = (type: any) => {
        setSelectedPeriod(type);
    };

    const handleShareBtnPress = (state: boolean) => {
        setIsShare(!state);
    }

    const filderData = async () => {
        dispatch(modalHide());
        dispatch(setShare(isShare));
        if(isShare){
            await (dispatch as any)(getFilterShareRecording());
        }else{
            await (dispatch as any)(getFilterRecording(selectedPeriod, sortType));
        }
    };

    const renderButton = (type: 'asc' | 'desc', label: string) => (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleSort(type)}
            style={sortType === type ? styles.type_act_btn : styles.type_unact_btn}>
            <Text style={sortType === type ? [styles.type_btn_act_text, typography.h6] : [styles.type_btn_unact_text, typography.h6]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <Modal
            animationType="fade" // Options: 'none', 'slide', 'fade'
            transparent={true}
            visible={isVisible}
            onRequestClose={() => dispatch(modalHide())}
        >
            <TouchableOpacity
                onPress={() => dispatch(modalHide())}
                style={styles.modalOverlay}>
                <StatusBar barStyle="light-content" backgroundColor="rgba(120, 126, 128, 1)" />
                <TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                        <View style={styles.modal_title_part}>
                            <Image source={filter_icon} />
                            <Text style={[styles.modal_title, typography.h1]}>Filter</Text>
                        </View>
                        <View style={{ marginBottom: 6 }}>
                            <View style={styles.sub_title_part}>
                                <Text style={[styles.sub_title, typography.h3]}>Creation Date</Text>
                                <TouchableOpacity
                                    onPress={filterReset}
                                >
                                    <Text style={[styles.reset_text, typography.h7]}>Reset all</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.date_group}>
                                {period.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        activeOpacity={0.7}
                                        style={styles.date_item}
                                        onPress={() => handlePress(item.value)}>
                                        {selectedPeriod === item.value ? (
                                            <FontAwesomeIcon icon={faCircleCheck} size={20} color={colors.green} />
                                        ) : (
                                            <FontAwesomeIcon icon={faCircleCheck} size={20} color={colors.green} style={styles.hidden} />
                                        )}
                                        <Text style={[styles.date_title, typography.h4]}>{item.type}</Text>
                                        <FontAwesomeIcon icon={faCircleCheck} size={20} color={colors.green} style={styles.hidden} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                        <View style={{ marginBottom: 6 }}>
                            <View style={styles.sub_title_part}>
                                <Text style={[styles.sub_title, typography.h3]}>Type</Text>
                                <Text style={{ opacity: 0 }}>Type</Text>
                            </View>
                            <View style={styles.btn_group}>
                                {renderButton('asc', 'Newest to Oldest')}
                                {renderButton('desc', 'Oldest to Newest')}
                            </View>
                        </View>
                        <View style={{ marginBottom: 18, width: '100%' }}>
                            <View style={styles.sub_title_part}>
                                <Text style={[styles.sub_title, typography.h3]}>Shared</Text>
                                <Text style={{ opacity: 0 }}>Type</Text>
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={isShare ? styles.share_act_btn : styles.share_unact_btn}
                                onPress={() => handleShareBtnPress(isShare)}
                            >
                                <Text
                                    style={isShare ? [styles.share_act_text, typography.h4] : [styles.share_unact_text, typography.h4]}
                                >
                                    Shared with Me
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ paddingHorizontal: 13, width: '100%' }}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={filderData}
                                style={[styles.apply_btn, commonStyles.box_show]}
                            >
                                <Text style={[styles.apply_btn_text, typography.h4]}>Apply Filter</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>

    );
};

const styles = StyleSheet.create({

    // modal css
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContent: {
        width: '100%',
        padding: 20,
        paddingHorizontal: 14,
        paddingVertical: 17,
        backgroundColor: colors.white,
        borderRadius: 20,
        alignItems: 'center',
    },
    modal_title_part: {
        gap: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    modal_title: {
        fontWeight: 'bold',
        color: colors.bandingblack,
    },
    sub_title_part: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sub_title: {
        fontWeight: 'bold',
        color: colors.bandingblack,
    },
    reset_text: {
        color: colors.red,
        fontWeight: '500',
    },
    date_group: {
        flexDirection: 'column',
        gap: 10,
    },
    date_item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        borderRadius: 30,
        borderColor: colors.gray,
        borderWidth: 1,
        paddingHorizontal: 15,
        paddingVertical: 6,
        alignItems: 'center',
    },
    hidden: {
        opacity: 0,
    },
    date_title: {
        color: colors.bandingblack,
    },
    btn_group: {
        flexDirection: 'row',
        gap: 5,
    },
    type_act_btn: {
        flex: 1,
        paddingVertical: 9,
        borderRadius: 30,
        backgroundColor: colors.green,
        borderColor: colors.green,
        borderWidth: 1,
    },
    type_unact_btn: {
        paddingVertical: 9,
        flex: 1,
        borderRadius: 30,
        backgroundColor: colors.white,
        borderColor: colors.gray,
        borderWidth: 1,
    },
    type_btn_act_text: {
        alignSelf: 'center',
        fontWeight: '500',
        color: colors.white,
    },
    type_btn_unact_text: {
        alignSelf: 'center',
        fontWeight: '500',
        color: colors.bandingblack,
    },
    share_act_btn: {
        width: '100%',
        paddingVertical: 6,
        borderRadius: 30,
        backgroundColor: colors.green,
        borderColor: colors.green,
        borderWidth: 1,
    },
    share_unact_btn: {
        width: '100%',
        paddingVertical: 6,
        borderRadius: 30,
        backgroundColor: colors.white,
        borderColor: colors.gray,
        borderWidth: 1,
    },
    share_act_text: {
        alignSelf: 'center',
        fontWeight: '500',
        color: colors.white,
    },
    share_unact_text: {
        alignSelf: 'center',
        fontWeight: '500',
        color: colors.bandingblack,
    },
    apply_btn: {
        paddingVertical: 15,
        backgroundColor: colors.brown,
        borderRadius: 30,
    },
    apply_btn_text: {
        alignSelf: 'center',
        color: colors.white,
        fontWeight: 'bold',
    }

});

export default FilterModal;
