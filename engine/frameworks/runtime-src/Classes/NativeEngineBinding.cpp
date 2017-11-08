#include <string>
#include <sstream>
#include <vector>
#include <iostream>

#include "base/CCDirector.h"
#include "base/CCScheduler.h"

#include "extensions/cocos-ext.h"
#include "scripting/js-bindings/manual/ScriptingCore.h"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "scripting/js-bindings/auto/jsb_cocos2dx_auto.hpp"
#include <thread>

#include "msgpack.hpp"

#include "BattleArena.h"
#include "BaseGame.h"
#include "DuelGame.h"
#include "TrainingGame.h"
#include "NativeEngineBinding.h"
#include "MasterData.h"

USING_NS_CC;
USING_NS_CC_EXT;

using namespace std;

double FPLongToDouble(const FPLong& value)
{
    return (double)value.gut / (1 << BITS_SHIFT);
}

vector<BaseGame*> gamesPool;

void initializeNativeEngine()
{
    destroyNativeEngine();
}

void destroyNativeEngine()
{
    for (auto it = gamesPool.begin(); it != gamesPool.end(); ++it)
    {
        auto p = (*it);
        delete p;
    }

    gamesPool.clear();
}

BaseGame* getNativeGame(uint32_t id)
{
    if (id < gamesPool.size())
    {
        return gamesPool[id];
    }
    return NULL;
}

bool js_nativeEngine_requireGame(JSContext* ctx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    string typeName;
    bool ok = jsval_to_std_string(ctx, args.get(0), &typeName);
    JSB_PRECONDITION2(ok, ctx, false, "js_facebook_api : Error processing arguments");

    cocos2d::log("[Native Engine] require game %s", typeName.c_str());


    uint32_t index = 0;
    for (auto it = gamesPool.begin(); it != gamesPool.end(); ++it)
    {
        BaseGame* p = (*it);
        if (!p->IsActive() && p->IsTypeName(typeName)) {
            p->Reset();
            break;
        }

        ++index;
    }

    if (index >= gamesPool.size()) {
        BaseGame* p = NULL;
        if (typeName.compare("Training") == 0) {
            p = new TrainingGame();
        } else if (typeName.compare("Duel") == 0) {
            p = new DuelGame();
        } else {
            p = new DuelGame();
        }

        p->SetTypeName(typeName);
        gamesPool.push_back(p);
    }

    args.rval().set(INT_TO_JSVAL((int)index));

    return true;
}

bool js_nativeEngine_freeGame(JSContext* ctx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    uint32_t gameId;
    bool ok = jsval_to_uint32( ctx, args.get(0), &gameId );
    JSB_PRECONDITION2(ok, ctx, false, "Error processing arguments");

    cocos2d::log("[Native Engine] free game %d", gameId);

    BaseGame* p = getNativeGame(gameId);
    if (p) {
        p->SetActive(false);
    }

    return true;
}

bool js_nativeEngine_setGameTurn(JSContext* ctx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    uint32_t gameId;
    bool ok = jsval_to_uint32( ctx, args.get(0), &gameId );
    JSB_PRECONDITION2(ok, ctx, false, "Error processing arguments");

    BaseGame* p = getNativeGame(gameId);
    if (p)
    {
        JS::RootedObject jsobj(ctx);
        bool ok = JS_ValueToObject( ctx, args.get(1), &jsobj );
        JSB_PRECONDITION2( ok && jsobj, ctx, false, "Error converting value to object");

        uint8_t* data = JS_GetArrayBufferData(jsobj);
        uint32_t dataLength = JS_GetArrayBufferByteLength(jsobj);

        msgpack::object_handle oh = msgpack::unpack((const char*)data, dataLength);
        msgpack::object msg = oh.get();

        map<string, msgpack::object> msgMap;
        msg.convert(msgMap);

        JS::RootedObject jsResponse(ctx, JS_NewObject(ctx, NULL, JS::NullPtr(), JS::NullPtr()));

        string msgType = msgMap["type"].as<string>();

        bool isChecksumMatched = true;

        if (msgType.compare("turn") == 0)
        {
            TurnUpdate turnUpdate;
            msgMap["data"].convert(turnUpdate);

            isChecksumMatched = p->SetGameTurn(turnUpdate);

            BattlePlayer& myPlayer = p->GetMyPlayer();
            JS_SetProperty(ctx, jsResponse, "myPlayerEnergy", JS::RootedValue(ctx, int32_to_jsval(ctx, myPlayer.GetEnergy())));
            JS_SetProperty(ctx, jsResponse, "isChecksumMatched", JS::RootedValue(ctx, BOOLEAN_TO_JSVAL(isChecksumMatched)));
        }
        else if (msgType.compare("replay") == 0)
        {
            Replay replay;
            msgMap["data"].convert(replay);

            p->SetReplayData(replay);

            ReplayPlayer& myPlayer = replay.players[replay.myPlayerIndex];

            vector<string> myCardSelectionNames;
            vector<int> myCardSelectionLevels;
            for (auto& selection : myPlayer.cardSelection)
            {
                myCardSelectionNames.push_back((selection.name));
                myCardSelectionLevels.push_back((selection.level));
            }

            JS_SetProperty(ctx, jsResponse, "myPlayerIndex", JS::RootedValue(ctx, int32_to_jsval(ctx, replay.myPlayerIndex)));
            JS_SetProperty(ctx, jsResponse, "myPlayerEnergy", JS::RootedValue(ctx, int32_to_jsval(ctx, myPlayer.energy)));
            JS_SetProperty(ctx, jsResponse, "myCardSelectionNames", JS::RootedValue(ctx, std_vector_string_to_jsval(ctx, myCardSelectionNames)));
            JS_SetProperty(ctx, jsResponse, "myCardSelectionLevels", JS::RootedValue(ctx, std_vector_int_to_jsval(ctx, myCardSelectionLevels)));
            JS_SetProperty(ctx, jsResponse, "myTeam", JS::RootedValue(ctx, int32_to_jsval(ctx, myPlayer.team)));
            JS_SetProperty(ctx, jsResponse, "myCurrentCards", JS::RootedValue(ctx, std_vector_int_to_jsval(ctx, myPlayer.currentCards)));            
            JS_SetProperty(ctx, jsResponse, "myNextCardIndex", JS::RootedValue(ctx, int32_to_jsval(ctx, myPlayer.nextCardIndex)));

            JS_SetProperty(ctx, jsResponse, "isChecksumMatched", JS::RootedValue(ctx, BOOLEAN_TO_JSVAL(isChecksumMatched)));
        }

        JS_SetProperty(ctx, jsResponse, "type", JS::RootedValue(ctx, std_string_to_jsval(ctx, msgType)));

        args.rval().set(OBJECT_TO_JSVAL(jsResponse));
    }

    return true;
}

bool js_nativeEngine_updateGame(JSContext* ctx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    uint32_t gameId;
    bool ok = jsval_to_uint32( ctx, args.get(0), &gameId );
    JSB_PRECONDITION2(ok, ctx, false, "Error processing arguments");

    BaseGame* p = getNativeGame(gameId);
    if (p)
    {
        p->Update(0);
    }

    return true;
}

bool js_nativeEngine_getLatestTurnUpdate(JSContext* ctx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    uint32_t gameId;
    bool ok = jsval_to_uint32( ctx, args.get(0), &gameId );
    JSB_PRECONDITION2(ok, ctx, false, "Error processing arguments");

    BaseGame* p = getNativeGame(gameId);
    if (p)
    {
        // TODO
        /*const TurnUpdate& turnUpdate = p->GetTurnUpdate(p->GetTurn() - 1);

        JS::RootedObject jsResponse(ctx, JS_NewObject(ctx, NULL, JS::NullPtr(), JS::NullPtr()));
        JS_SetProperty(ctx, jsResponse, "turn", JS::RootedValue(ctx, int32_to_jsval(ctx, turnUpdate.turn)));
        JS_SetProperty(ctx, jsResponse, "checksum", JS::RootedValue(ctx, int32_to_jsval(ctx, turnUpdate.checksum)));

        args.rval().set(OBJECT_TO_JSVAL(jsResponse));*/
    }

    return true;
}

bool js_nativeEngine_setMasterDataJson(JSContext* ctx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    uint32_t gameId;
    bool ok = jsval_to_uint32( ctx, args.get(0), &gameId );
    JSB_PRECONDITION2(ok, ctx, false, "Error processing arguments");

    BaseGame* p = getNativeGame(gameId);
    if (p)
    {
        int32_t version;
        ok = jsval_to_int32( ctx, args.get(1), &version );
        JSB_PRECONDITION2(ok, ctx, false, "Error processing arguments");

        std::string jsonUnitsData;
        ok &= jsval_to_std_string(ctx, args.get(2), &jsonUnitsData);
        JSB_PRECONDITION2(ok, ctx, false, "Error processing arguments");

        std::string jsonArenaData;
        ok &= jsval_to_std_string(ctx, args.get(3), &jsonArenaData);
        JSB_PRECONDITION2(ok, ctx, false, "Error processing arguments");

        MasterData* masterData = new MasterData(version);
        masterData->SetUnitsData(jsonUnitsData);
        masterData->SetArenaData(jsonArenaData);

        p->SetMasterData(masterData);        
        masterData->Release();
    }
}

bool js_nativeEngine_getArenaData(JSContext* ctx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    uint32_t gameId;
    bool ok = jsval_to_uint32( ctx, args.get(0), &gameId );
    JSB_PRECONDITION2(ok, ctx, false, "Error processing arguments");

    BaseGame* p = getNativeGame(gameId);    
    if (p)
    {
        std::string arenaName;
        ok &= jsval_to_std_string(ctx, args.get(1), &arenaName);
        JSB_PRECONDITION2(ok, ctx, false, "Error processing arguments");

        const ArenaData& data = p->GetMasterData()->GetArena(arenaName);

        JS::RootedObject jsResponse(ctx, JS_NewObject(ctx, NULL, JS::NullPtr(), JS::NullPtr()));
        JS_SetProperty(ctx, jsResponse, "width", JS::RootedValue(ctx, int32_to_jsval(ctx, data.width)));
        JS_SetProperty(ctx, jsResponse, "height", JS::RootedValue(ctx, int32_to_jsval(ctx, data.height)));
        JS_SetProperty(ctx, jsResponse, "trophy", JS::RootedValue(ctx, int32_to_jsval(ctx, data.trophy)));
        JS_SetProperty(ctx, jsResponse, "winGold", JS::RootedValue(ctx, int32_to_jsval(ctx, data.winGold)));

        args.rval().set(OBJECT_TO_JSVAL(jsResponse));
    }
}

bool js_nativeEngine_getEntities(JSContext* ctx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    uint32_t gameId;
    bool ok = jsval_to_uint32( ctx, args.get(0), &gameId );
    JSB_PRECONDITION2(ok, ctx, false, "Error processing arguments");

    BaseGame* p = getNativeGame(gameId);
    if (p)
    {
        uint32_t i = 0;
        vector<shared_ptr<BattleEntity>>& entities = p->GetEntities();
        JS::RootedObject jsResponse(ctx, JS_NewArrayObject(ctx, entities.size()));
        for (shared_ptr<BattleEntity> entity : entities)
        {
            JS::RootedObject jsEntity(ctx, JS_NewObject(ctx, NULL, JS::NullPtr(), JS::NullPtr()));
            JS_SetProperty(ctx, jsEntity, "id", JS::RootedValue(ctx, int32_to_jsval(ctx, entity->GetID())));
            JS_SetProperty(ctx, jsEntity, "classId", JS::RootedValue(ctx, int32_to_jsval(ctx, entity->GetClassID())));
            JS_SetProperty(ctx, jsEntity, "typeName", JS::RootedValue(ctx, std_string_to_jsval(ctx, entity->GetTypeName())));
            JS_SetProperty(ctx, jsEntity, "level", JS::RootedValue(ctx, int32_to_jsval(ctx, entity->GetLevel())));
            JS_SetProperty(ctx, jsEntity, "team", JS::RootedValue(ctx, int32_to_jsval(ctx, entity->GetTeam())));

            const FPLongVec3& position = entity->GetPosition();
            JS_SetProperty(ctx, jsEntity, "x", JS::RootedValue(ctx, DOUBLE_TO_JSVAL(FPLongToDouble(position.x))));
            JS_SetProperty(ctx, jsEntity, "y", JS::RootedValue(ctx, DOUBLE_TO_JSVAL(FPLongToDouble(position.y))));
            JS_SetProperty(ctx, jsEntity, "z", JS::RootedValue(ctx, DOUBLE_TO_JSVAL(FPLongToDouble(position.z))));

            JS_SetElement(ctx, jsResponse, i, jsEntity);
            ++i;
        }

        args.rval().set(OBJECT_TO_JSVAL(jsResponse));
    }
}

bool js_nativeEngine_getCardFormation(JSContext* ctx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    uint32_t gameId;
    bool ok = jsval_to_uint32( ctx, args.get(0), &gameId );
    JSB_PRECONDITION2(ok, ctx, false, "Error processing arguments");

    std::string name;
    ok &= jsval_to_std_string(ctx, args.get(1), &name);
    JSB_PRECONDITION2(ok, ctx, false, "Error processing arguments");

    uint32_t level;
    ok &= jsval_to_uint32( ctx, args.get(2), &level );
    JSB_PRECONDITION2(ok, ctx, false, "Error processing arguments");

    BaseGame* p = getNativeGame(gameId);
    if (p)
    {
        vector<DeployFormation> formation;
        p->GetCardFormation(formation, name, level);

        uint32_t i = 0;
        JS::RootedObject jsResponse(ctx, JS_NewArrayObject(ctx, formation.size()));
        for (DeployFormation& f : formation)
        {
            JS::RootedObject jsElement(ctx, JS_NewObject(ctx, NULL, JS::NullPtr(), JS::NullPtr()));
            JS_SetProperty(ctx, jsElement, "name", JS::RootedValue(ctx, std_string_to_jsval(ctx, f.name)));
            JS_SetProperty(ctx, jsElement, "level", JS::RootedValue(ctx, int32_to_jsval(ctx, f.level)));
            JS_SetProperty(ctx, jsElement, "x", JS::RootedValue(ctx, int32_to_jsval(ctx, f.x)));
            JS_SetProperty(ctx, jsElement, "y", JS::RootedValue(ctx, int32_to_jsval(ctx, f.y)));

            JS_SetElement(ctx, jsResponse, i, jsElement);
            ++i;
        }


        args.rval().set(OBJECT_TO_JSVAL(jsResponse));
    }
}

bool js_nativeEngine_isDeployableAt(JSContext* ctx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    uint32_t gameId;
    bool ok = jsval_to_uint32( ctx, args.get(0), &gameId );
    JSB_PRECONDITION2(ok, ctx, false, "Error processing arguments");

    std::string name;
    ok &= jsval_to_std_string(ctx, args.get(1), &name);
    JSB_PRECONDITION2(ok, ctx, false, "Error processing arguments");

    uint32_t team;
    ok &= jsval_to_uint32( ctx, args.get(2), &team );
    JSB_PRECONDITION2(ok, ctx, false, "Error processing arguments");

    uint32_t level;
    ok &= jsval_to_uint32( ctx, args.get(3), &level );
    JSB_PRECONDITION2(ok, ctx, false, "Error processing arguments");

    uint32_t x;
    ok &= jsval_to_uint32( ctx, args.get(4), &x );
    JSB_PRECONDITION2(ok, ctx, false, "Error processing arguments");

    uint32_t y;
    ok &= jsval_to_uint32( ctx, args.get(5), &y );
    JSB_PRECONDITION2(ok, ctx, false, "Error processing arguments");

    BaseGame* p = getNativeGame(gameId);
    if (p)
    {
        bool res = p->IsDeployable(name, team, level, x, y);
        args.rval().set(BOOLEAN_TO_JSVAL(res));
    }
}

bool js_nativeEngine_createTurnCommand(JSContext* ctx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    uint32_t gameId;
    bool ok = jsval_to_uint32( ctx, args.get(0), &gameId );
    JSB_PRECONDITION2(ok, ctx, false, "Error processing arguments");

    int32_t myPlayerIndex;
    ok &= jsval_to_int32( ctx, args.get(1), &myPlayerIndex );
    JSB_PRECONDITION2(ok, ctx, false, "Error processing arguments");

    int32_t command;
    ok &= jsval_to_int32( ctx, args.get(1), &command );
    JSB_PRECONDITION2(ok, ctx, false, "Error processing arguments");

    int32_t targetId;
    ok &= jsval_to_int32( ctx, args.get(3), &targetId );
    JSB_PRECONDITION2(ok, ctx, false, "Error processing arguments");

    int32_t x;
    ok &= jsval_to_int32( ctx, args.get(4), &x );
    JSB_PRECONDITION2(ok, ctx, false, "Error processing arguments");

    int32_t y;
    ok &= jsval_to_int32( ctx, args.get(5), &y );
    JSB_PRECONDITION2(ok, ctx, false, "Error processing arguments");

    int32_t ref;
    ok &= jsval_to_int32( ctx, args.get(6), &ref );
    JSB_PRECONDITION2(ok, ctx, false, "Error processing arguments");

    TurnCommand turn;
    turn.playerIndex = myPlayerIndex;
    turn.command = command;
    turn.targetId = targetId;
    turn.x = x;
    turn.y = y;
    turn.ref = ref;

    std::vector<TurnCommand> turnMap;
    turnMap.push_back(turn);

    msgpack::sbuffer sbuf;
    msgpack::pack(sbuf, turnMap);

    JS::RootedObject buffer(ctx, JS_NewArrayBuffer(ctx, static_cast<uint32_t>(sbuf.size())));
    uint8_t* bufdata = JS_GetArrayBufferData(buffer);
    memcpy((void*)bufdata, (void*)sbuf.data(), sbuf.size());

    args.rval().set(OBJECT_TO_JSVAL(buffer));
}

void register_native_engine(JSContext* cx, JS::HandleObject global)
{
    JS::RootedObject jsbObj(cx);
    get_or_create_js_obj(cx, global, "nativeEngine", &jsbObj);

    JS_DefineFunction(cx, jsbObj, "requireGame", js_nativeEngine_requireGame, 1, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, jsbObj, "freeGame", js_nativeEngine_freeGame, 1, JSPROP_READONLY | JSPROP_PERMANENT);

    JS_DefineFunction(cx, jsbObj, "setMasterDataJson", js_nativeEngine_setMasterDataJson, 4, JSPROP_READONLY | JSPROP_PERMANENT);

    JS_DefineFunction(cx, jsbObj, "setGameTurn", js_nativeEngine_setGameTurn, 2, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, jsbObj, "updateGame", js_nativeEngine_updateGame, 1, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, jsbObj, "getLatestTurnUpdate", js_nativeEngine_getLatestTurnUpdate, 1, JSPROP_READONLY | JSPROP_PERMANENT);

    JS_DefineFunction(cx, jsbObj, "getArenaData", js_nativeEngine_getArenaData, 2, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, jsbObj, "getEntities", js_nativeEngine_getEntities, 1, JSPROP_READONLY | JSPROP_PERMANENT);

    JS_DefineFunction(cx, jsbObj, "getCardFormation", js_nativeEngine_getCardFormation, 3, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, jsbObj, "isDeployableAt", js_nativeEngine_isDeployableAt, 6, JSPROP_READONLY | JSPROP_PERMANENT);

    JS_DefineFunction(cx, jsbObj, "createTurnCommand", js_nativeEngine_createTurnCommand, 3, JSPROP_READONLY | JSPROP_PERMANENT);
}
