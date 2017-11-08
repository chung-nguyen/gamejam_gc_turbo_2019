#include <android/log.h>

#include "utils.h"

jobject createJavaMapObject(std::map<std::string, std::string>* paramMap)
{
    JNIEnv* env = JniHelper::getEnv();
	jclass class_Hashtable = env->FindClass("java/util/Hashtable");
	jmethodID construct_method = env->GetMethodID( class_Hashtable, "<init>","()V");
	jobject obj_Map = env->NewObject( class_Hashtable, construct_method, "");
	if (paramMap != NULL)
	{
		jmethodID add_method= env->GetMethodID( class_Hashtable,"put","(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;");
		for (std::map<std::string, std::string>::const_iterator it = paramMap->begin(); it != paramMap->end(); ++it)
		{
            jstring first = env->NewStringUTF(it->first.c_str());
            jstring second = env->NewStringUTF(it->second.c_str());
			env->CallObjectMethod(obj_Map, add_method, first, second);
            env->DeleteLocalRef(first);
            env->DeleteLocalRef(second);
		}
	}
    env->DeleteLocalRef(class_Hashtable);
    return obj_Map;
}
