import type { Incident } from '@/types'
import { useAtom } from 'jotai'
import React from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import IncidentReport from '@/components/IncidentReport'
import { studentsListAtom } from '@/store/atoms'

const $grayColor = '#666'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  incidentItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: $grayColor,
  },
  incidentDate: {
    fontWeight: 'bold',
  },
  incidentDescription: {
    marginTop: 5,
  },
})

export default function IncidentsScreen() {
  // const [currentClass] = useAtom(currentClassAtom);
  const [students] = useAtom(studentsListAtom)

  // Mock data for incidents, replace with actual data fetching
  const [incidents, setIncidents] = React.useState<Incident[]>([])

  const handleSubmitIncident = (incident: Omit<Incident, 'id'>) => {
    // Here you would typically send this to your backend
    // For now, we'll just add it to our local state
    setIncidents([...incidents, { ...incident, id: Date.now().toString() }])
  }

  const renderIncidentItem = ({ item }: { item: Incident }) => (
    <View style={styles.incidentItem}>
      <Text style={styles.incidentDate}>{item.date}</Text>
      <Text style={styles.incidentDescription}>{item.description}</Text>
      <Text>
        Severity:
        {item.severity}
      </Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Incidents</Text>
      <IncidentReport students={students} onSubmit={handleSubmitIncident} />
      <FlatList
        data={incidents}
        renderItem={renderIncidentItem}
        keyExtractor={item => item.id}
      />
    </View>
  )
}
