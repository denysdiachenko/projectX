import { usePathname } from 'expo-router';
import { useEffect, useState } from 'react';

import { getIsShoppingListEmpty } from '@/services/shopping-list';

export function useShoppingListEmpty(eventId?: string) {
  const pathname = usePathname();
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    if (!eventId) return;

    let isActive = true;

    void getIsShoppingListEmpty(eventId)
      .then((nextIsEmpty) => {
        if (isActive) setIsEmpty(nextIsEmpty);
      })
      .catch(() => {
        if (isActive) setIsEmpty(false);
      });

    return () => {
      isActive = false;
    };
  }, [eventId, pathname]);

  return isEmpty;
}
