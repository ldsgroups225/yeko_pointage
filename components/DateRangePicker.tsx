import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDate } from "@/utils/dateTime";

type DateRangePickerProps = {
  startDate: Date;
  endDate: Date;
  onChangeStart: (date: Date) => void;
  onChangeEnd: (date: Date) => void;
};

export default function DateRangePicker({
  startDate,
  endDate,
  onChangeStart,
  onChangeEnd,
}: DateRangePickerProps) {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleStartChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) {
      onChangeStart(selectedDate);
    }
  };

  const handleEndChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate) {
      onChangeEnd(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.label}>Start Date:</Text>
        <TouchableOpacity onPress={() => setShowStartPicker(true)}>
          <Text style={styles.dateText}>{formatDate(startDate)}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dateContainer}>
        <Text style={styles.label}>End Date:</Text>
        <TouchableOpacity onPress={() => setShowEndPicker(true)}>
          <Text style={styles.dateText}>{formatDate(endDate)}</Text>
        </TouchableOpacity>
      </View>
      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={handleStartChange}
        />
      )}
      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={handleEndChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  dateContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
    color: "#007AFF",
  },
});
