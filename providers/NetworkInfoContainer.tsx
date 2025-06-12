import { useNetInfo } from '@react-native-community/netinfo'
import React, { useEffect, useState } from 'react'
import { Button, Modal, StyleSheet, Text, View } from 'react-native'

const $modalOverlayColor = 'rgba(0, 0, 0, 0.5)'
const $whiteColor = 'white'
const $shadowColor = '#000'

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: $modalOverlayColor,
  },
  modalView: {
    margin: 20,
    backgroundColor: $whiteColor,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: $shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
})

function NetworkInfoContainer({ children }: any) {
  const { isConnected } = useNetInfo()
  console.warn('isConnected', isConnected)
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    if (isConnected === false) {
      setModalVisible(true)
    }
    else {
      setModalVisible(false)
    }
  }, [isConnected])

  return (
    <View style={styles.flex1}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false)
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Check your internet connection!
            </Text>
            <Button title="Ok" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
      {children}
    </View>
  )
}

export default NetworkInfoContainer
