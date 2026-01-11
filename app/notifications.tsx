import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Bell, DollarSign, TrendingUp, FileText, AlertCircle, CheckCircle, Clock, Trash2, Shield } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';

type NotificationType = 'application' | 'offer' | 'payment' | 'credit' | 'investment' | 'alert' | 'reminder';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionLabel?: string;
  actionRoute?: string;
}

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'application',
    title: 'Application Approved',
    message: 'Your loan application with Wells Fargo has been approved! $15,000 at 7.8% APR.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    actionLabel: 'View Details',
    actionRoute: '/dashboard',
  },
  {
    id: 'n2',
    type: 'offer',
    title: 'New Loan Match',
    message: 'We found 3 new loan offers that match your profile with rates starting at 6.9% APR.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    read: false,
    actionLabel: 'View Offers',
    actionRoute: '/loan-offers',
  },
  {
    id: 'n3',
    type: 'credit',
    title: 'Credit Score Updated',
    message: 'Your credit score increased by 12 points! Now at 732. Keep up the good work!',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: 'n4',
    type: 'investment',
    title: 'P2P Investment Opportunity',
    message: 'New high-rated loan listing available: $10,000 at 9.2% return. Only 2 days left to invest.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
    actionLabel: 'Invest Now',
    actionRoute: '/p2p-marketplace',
  },
  {
    id: 'n5',
    type: 'payment',
    title: 'Payment Reminder',
    message: 'Your next payment of $342 is due in 5 days. Make sure your account is funded.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 'n6',
    type: 'alert',
    title: 'Document Required',
    message: 'Please upload your latest pay stub to complete your application with Chase.',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    read: true,
    actionLabel: 'Upload',
    actionRoute: '/document-vault',
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { bankConnectionDismissed, notificationsEnabled, connectBank } = useApp();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedFilter, setSelectedFilter] = useState<'all' | NotificationType>('all');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (bankConnectionDismissed && notificationsEnabled) {
      // Check if reminder already exists to avoid duplicates
      const hasReminder = notifications.some(n => n.id === 'integration-reminder');
      if (!hasReminder) {
        const reminder: Notification = {
          id: 'integration-reminder',
          type: 'reminder',
          title: 'Complete Your Profile',
          message: 'Connect your accounts to get more accurate offers and avoid wasting time on loans you won\'t qualify for.',
          timestamp: new Date(),
          read: false,
          actionLabel: 'Connect Now',
          actionRoute: '/dashboard', // Logic handles this
        };
        setNotifications(prev => [reminder, ...prev]);
      }
    }
  }, [bankConnectionDismissed, notificationsEnabled]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const filteredNotifications = notifications.filter(n => 
    selectedFilter === 'all' || n.type === selectedFilter
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'application':
        return <FileText color={colors.primary} size={20} strokeWidth={2.5} />;
      case 'offer':
        return <DollarSign color={colors.success} size={20} strokeWidth={2.5} />;
      case 'payment':
        return <Clock color={colors.warning} size={20} strokeWidth={2.5} />;
      case 'credit':
        return <TrendingUp color={colors.info} size={20} strokeWidth={2.5} />;
      case 'investment':
        return <DollarSign color={colors.secondary} size={20} strokeWidth={2.5} />;
      case 'alert':
        return <AlertCircle color={colors.error} size={20} strokeWidth={2.5} />;
      case 'reminder':
        return <Shield color={colors.primary} size={20} strokeWidth={2.5} />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'application': return colors.primary;
      case 'offer': return colors.success;
      case 'payment': return colors.warning;
      case 'credit': return colors.info;
      case 'investment': return colors.secondary;
      case 'alert': return colors.error;
      case 'reminder': return colors.primary;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft color={colors.text} size={24} strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
<TouchableOpacity
            style={styles.backButton}
            onPress={markAllAsRead}
            activeOpacity={0.7}
          >
            <CheckCircle color={colors.primary} size={22} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
            <TouchableOpacity
              style={[styles.filterChip, selectedFilter === 'all' && styles.filterChipActive]}
              onPress={() => setSelectedFilter('all')}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterChipText, selectedFilter === 'all' && styles.filterChipTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, selectedFilter === 'application' && styles.filterChipActive]}
              onPress={() => setSelectedFilter('application')}
              activeOpacity={0.7}
            >
              <View style={[styles.filterDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.filterChipText, selectedFilter === 'application' && styles.filterChipTextActive]}>
                Applications
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, selectedFilter === 'offer' && styles.filterChipActive]}
              onPress={() => setSelectedFilter('offer')}
              activeOpacity={0.7}
            >
              <View style={[styles.filterDot, { backgroundColor: colors.success }]} />
              <Text style={[styles.filterChipText, selectedFilter === 'offer' && styles.filterChipTextActive]}>
                Offers
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, selectedFilter === 'credit' && styles.filterChipActive]}
              onPress={() => setSelectedFilter('credit')}
              activeOpacity={0.7}
            >
              <View style={[styles.filterDot, { backgroundColor: colors.info }]} />
              <Text style={[styles.filterChipText, selectedFilter === 'credit' && styles.filterChipTextActive]}>
                Credit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, selectedFilter === 'investment' && styles.filterChipActive]}
              onPress={() => setSelectedFilter('investment')}
              activeOpacity={0.7}
            >
              <View style={[styles.filterDot, { backgroundColor: colors.secondary }]} />
              <Text style={[styles.filterChipText, selectedFilter === 'investment' && styles.filterChipTextActive]}>
                Investments
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {filteredNotifications.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Bell color={colors.textTertiary} size={48} strokeWidth={1.5} />
              </View>
              <Text style={styles.emptyTitle}>No Notifications</Text>
              <Text style={styles.emptySubtext}>You&apos;re all caught up! Check back later for updates.</Text>
            </View>
          ) : (
            <Animated.View style={[styles.notificationsList, { opacity: fadeAnim }]}>
              {filteredNotifications.map((notification, index) => (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    styles.notificationCard,
                    !notification.read && styles.notificationCardUnread,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => {
                    markAsRead(notification.id);
                    if (notification.type === 'reminder') {
                      connectBank();
                      router.push('/dashboard' as any);
                    } else if (notification.actionRoute) {
                      router.push(notification.actionRoute as any);
                    }
                  }}
                >
                  <View style={styles.notificationContent}>
                    <View style={[styles.notificationIconContainer, { backgroundColor: getNotificationColor(notification.type) + '20' }]}>
                      {getNotificationIcon(notification.type)}
                    </View>
                    <View style={styles.notificationTextContainer}>
                      <View style={styles.notificationHeader}>
                        <Text style={styles.notificationTitle}>{notification.title}</Text>
                        {!notification.read && <View style={styles.unreadDot} />}
                      </View>
                      <Text style={styles.notificationMessage}>{notification.message}</Text>
                      <View style={styles.notificationFooter}>
                        <Text style={styles.notificationTimestamp}>{formatTimestamp(notification.timestamp)}</Text>
                        {notification.actionLabel && (
                          <Text style={styles.notificationAction}>{notification.actionLabel}</Text>
                        )}
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    activeOpacity={0.7}
                  >
                    <Trash2 color={colors.textTertiary} size={18} strokeWidth={2} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </Animated.View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...colors.shadow,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.4,
  },
  unreadBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: colors.white,
    letterSpacing: -0.1,
  },
  filtersContainer: {
    paddingVertical: 12,
  },
  filtersScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  filterChipTextActive: {
    color: colors.white,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  emptySubtext: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  notificationsList: {
    gap: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  notificationCardUnread: {
    borderColor: colors.primary + '40',
    backgroundColor: colors.surface,
  },
  notificationContent: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  notificationTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  notificationMessage: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
    letterSpacing: -0.1,
  },
  notificationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationTimestamp: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.textTertiary,
    letterSpacing: -0.1,
  },
  notificationAction: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.primary,
    letterSpacing: -0.1,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surfaceTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
