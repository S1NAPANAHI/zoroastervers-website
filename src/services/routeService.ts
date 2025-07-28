interface StoryRoute {
  id: string;
  route_key: string;
  title: string;
  description: string;
  item_id: string;
  item_type: string;
  is_unlocked: boolean;
  is_current: boolean;
  is_default_route: boolean;
  requires_previous_completion: boolean;
  difficulty_level: number;
  estimated_duration: number;
  completion_rewards: any;
  narrative_impact: string;
  unlock_hint: string;
  unlock_conditions: any;
  order_index: number;
}

export const fetchAvailableRoutes = async (
  itemId: string, 
  itemType: string
): Promise<StoryRoute[]> => {
  try {
    const response = await fetch(
      `/api/books/choose-route?item_id=${itemId}&item_type=${itemType}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const routes = await response.json();
    return routes;
  } catch (error) {
    console.error('Error fetching available routes:', error);
    throw error;
  }
};

export const chooseRoute = async (
  routeId: string, 
  itemId: string, 
  itemType: string
): Promise<any> => {
  try {
    const response = await fetch('/api/books/choose-route', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        route_id: routeId,
        item_id: itemId,
        item_type: itemType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error choosing route:', error);
    throw error;
  }
};

export const updateUserProgress = async (
  itemId: string,
  itemType: string,
  progressData: {
    percent_complete?: number;
    last_position?: string;
    total_reading_time?: number;
  }
): Promise<any> => {
  try {
    const response = await fetch('/api/books/progress', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        item_id: itemId,
        item_type: itemType,
        ...progressData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
};
