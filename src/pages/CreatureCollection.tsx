import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../../supabaseClient";
import { Creature } from "../types/creature";
import { TextCore } from "../coreComponents/textCore/TextCore";
import { ButtonCore } from "../coreComponents/buttonCore/ButtonCore";
import { classNameParserCore } from "../coreFunctions/classNameParserCore/classNameParserCore";
import { useNavigate } from "react-router-dom";

const CreatureCollection = () => {
  const { user } = useAuth();
  const [creatures, setCreatures] = React.useState<Creature[]>([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchCreatures = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from("creatures")
          .select("*")
          .eq("user_id", user.id);

        if (error) throw error;
        setCreatures(data || []);
      } catch (error) {
        console.error("Error fetching creatures:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatures();
  }, [user]);

  const handleCreatureClick = (creatureId: string) => {
    navigate(`/creature/${creatureId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <TextCore text="My Collection" className="text-2xl font-bold" />
        <ButtonCore
          text="Back to Battlefield"
          onClick={() => navigate("/battlefield")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {creatures.map((creature) => (
          <div
            key={creature.id}
            className={classNameParserCore(
              "bg-white rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow duration-200"
            )}
            onClick={() => handleCreatureClick(creature.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <TextCore text={creature.name} className="text-xl font-bold" />
              <div className="flex items-center space-x-2">
                <span className="text-yellow-500">★</span>
                <TextCore text={creature.level.toString()} />
              </div>
            </div>

            <div className="relative w-full h-48 mb-4">
              <img
                src={creature.image_url}
                alt={creature.name}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-red-500">❤️</span>
                <div>
                  <TextCore text="HP" className="text-sm text-gray-600" />
                  <TextCore text={creature.hp.toString()} />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-500">⚔️</span>
                <div>
                  <TextCore text="Attack" className="text-sm text-gray-600" />
                  <TextCore text={creature.attack.toString()} />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">🛡️</span>
                <div>
                  <TextCore text="Defense" className="text-sm text-gray-600" />
                  <TextCore text={creature.defense.toString()} />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-purple-500">⚡</span>
                <div>
                  <TextCore text="Speed" className="text-sm text-gray-600" />
                  <TextCore text={creature.speed.toString()} />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-orange-500">🎯</span>
                  <TextCore text={`${creature.wins} Wins`} />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-500">🏆</span>
                  <TextCore text={`${creature.experience} XP`} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {creatures.length === 0 && (
        <div className="text-center py-8">
          <TextCore
            text="No creatures in your collection yet!"
            className="text-xl"
          />
          <ButtonCore
            text="Go to Battlefield"
            onClick={() => navigate("/battlefield")}
            className="mt-4"
          />
        </div>
      )}
    </div>
  );
};

export default CreatureCollection;
