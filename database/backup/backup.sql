PGDMP     &    (                 |            traductor_ia    15.4    15.4 &    2           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            3           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            4           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            5           1262    23616    traductor_ia    DATABASE     �   CREATE DATABASE traductor_ia WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Bolivia.1252';
    DROP DATABASE traductor_ia;
                postgres    false            �            1259    23871    bitacora    TABLE     �   CREATE TABLE public.bitacora (
    uid uuid NOT NULL,
    accion character varying(2000) NOT NULL,
    fecha date NOT NULL,
    hora time without time zone NOT NULL,
    uid_usuario uuid,
    uid_empresa uuid
);
    DROP TABLE public.bitacora;
       public         heap    postgres    false            �            1259    23844    chat    TABLE     �   CREATE TABLE public.chat (
    uid uuid NOT NULL,
    id_socket character varying(100) NOT NULL,
    uid_usuario_emisor uuid,
    uid_usuario_receptor uuid,
    estado boolean
);
    DROP TABLE public.chat;
       public         heap    postgres    false            �            1259    23792    empresa    TABLE     �  CREATE TABLE public.empresa (
    uid uuid NOT NULL,
    nombre_empresa character varying(100) NOT NULL,
    correo_electronico character varying(100) NOT NULL,
    password_user character varying(100) NOT NULL,
    direccion character varying(100) NOT NULL,
    ciudad character varying(100) NOT NULL,
    tipo_entidad character varying(100) NOT NULL,
    nit bigint NOT NULL,
    logo_url character varying(2000),
    estado boolean,
    rol_user character varying(20),
    cantidad_usuarios integer
);
    DROP TABLE public.empresa;
       public         heap    postgres    false            �            1259    23617    lenguas_iso    TABLE     �   CREATE TABLE public.lenguas_iso (
    uid uuid NOT NULL,
    iso_language character varying(50) NOT NULL,
    code_639 character(2) NOT NULL
);
    DROP TABLE public.lenguas_iso;
       public         heap    postgres    false            �            1259    23859    messages    TABLE       CREATE TABLE public.messages (
    uid uuid NOT NULL,
    mensaje character varying(2000) NOT NULL,
    uid_chat uuid,
    uid_usuario uuid,
    audio_url character varying(2000),
    code_639 character(2),
    estado boolean,
    fecha date,
    hora time without time zone
);
    DROP TABLE public.messages;
       public         heap    postgres    false            �            1259    23771    plan_suscripcion    TABLE     �   CREATE TABLE public.plan_suscripcion (
    uid uuid NOT NULL,
    nombre_plan character varying(50) NOT NULL,
    descripcion character varying(100) NOT NULL,
    precio_por_usuario integer NOT NULL,
    periodo character varying(50) NOT NULL
);
 $   DROP TABLE public.plan_suscripcion;
       public         heap    postgres    false            �            1259    23799    suscripcion    TABLE     �   CREATE TABLE public.suscripcion (
    uid uuid NOT NULL,
    estado boolean NOT NULL,
    fecha_inicio date NOT NULL,
    fecha_fin date NOT NULL,
    uid_plan_suscripcion uuid,
    uid_empresa uuid,
    total_pagado integer
);
    DROP TABLE public.suscripcion;
       public         heap    postgres    false            �            1259    23814    usuario    TABLE     �  CREATE TABLE public.usuario (
    uid uuid NOT NULL,
    fullname character varying(100) NOT NULL,
    correo_electronico character varying(100) NOT NULL,
    password_user character varying(100) NOT NULL,
    foto_perfil_url character varying(2000),
    rol_user character varying(20) NOT NULL,
    uid_empresa uuid,
    uid_lenguas_iso uuid,
    uid_contacto uuid,
    estado boolean
);
    DROP TABLE public.usuario;
       public         heap    postgres    false            /          0    23871    bitacora 
   TABLE DATA           V   COPY public.bitacora (uid, accion, fecha, hora, uid_usuario, uid_empresa) FROM stdin;
    public          postgres    false    221   �2       -          0    23844    chat 
   TABLE DATA           `   COPY public.chat (uid, id_socket, uid_usuario_emisor, uid_usuario_receptor, estado) FROM stdin;
    public          postgres    false    219   �2       *          0    23792    empresa 
   TABLE DATA           �   COPY public.empresa (uid, nombre_empresa, correo_electronico, password_user, direccion, ciudad, tipo_entidad, nit, logo_url, estado, rol_user, cantidad_usuarios) FROM stdin;
    public          postgres    false    216   4       (          0    23617    lenguas_iso 
   TABLE DATA           B   COPY public.lenguas_iso (uid, iso_language, code_639) FROM stdin;
    public          postgres    false    214   G5       .          0    23859    messages 
   TABLE DATA           q   COPY public.messages (uid, mensaje, uid_chat, uid_usuario, audio_url, code_639, estado, fecha, hora) FROM stdin;
    public          postgres    false    220   A7       )          0    23771    plan_suscripcion 
   TABLE DATA           f   COPY public.plan_suscripcion (uid, nombre_plan, descripcion, precio_por_usuario, periodo) FROM stdin;
    public          postgres    false    215   =       +          0    23799    suscripcion 
   TABLE DATA           |   COPY public.suscripcion (uid, estado, fecha_inicio, fecha_fin, uid_plan_suscripcion, uid_empresa, total_pagado) FROM stdin;
    public          postgres    false    217   >       ,          0    23814    usuario 
   TABLE DATA           �   COPY public.usuario (uid, fullname, correo_electronico, password_user, foto_perfil_url, rol_user, uid_empresa, uid_lenguas_iso, uid_contacto, estado) FROM stdin;
    public          postgres    false    218   �>       �           2606    23875    bitacora bitacora_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public.bitacora
    ADD CONSTRAINT bitacora_pkey PRIMARY KEY (uid);
 @   ALTER TABLE ONLY public.bitacora DROP CONSTRAINT bitacora_pkey;
       public            postgres    false    221            �           2606    23848    chat chat_pkey 
   CONSTRAINT     M   ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_pkey PRIMARY KEY (uid);
 8   ALTER TABLE ONLY public.chat DROP CONSTRAINT chat_pkey;
       public            postgres    false    219            �           2606    23798    empresa empresa_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT empresa_pkey PRIMARY KEY (uid);
 >   ALTER TABLE ONLY public.empresa DROP CONSTRAINT empresa_pkey;
       public            postgres    false    216            �           2606    23621    lenguas_iso lenguas_iso_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.lenguas_iso
    ADD CONSTRAINT lenguas_iso_pkey PRIMARY KEY (uid);
 F   ALTER TABLE ONLY public.lenguas_iso DROP CONSTRAINT lenguas_iso_pkey;
       public            postgres    false    214            �           2606    23865    messages messages_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (uid);
 @   ALTER TABLE ONLY public.messages DROP CONSTRAINT messages_pkey;
       public            postgres    false    220            �           2606    23775 &   plan_suscripcion plan_suscripcion_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.plan_suscripcion
    ADD CONSTRAINT plan_suscripcion_pkey PRIMARY KEY (uid);
 P   ALTER TABLE ONLY public.plan_suscripcion DROP CONSTRAINT plan_suscripcion_pkey;
       public            postgres    false    215            �           2606    23803    suscripcion suscripcion_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.suscripcion
    ADD CONSTRAINT suscripcion_pkey PRIMARY KEY (uid);
 F   ALTER TABLE ONLY public.suscripcion DROP CONSTRAINT suscripcion_pkey;
       public            postgres    false    217            �           2606    23818    usuario usuario_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (uid);
 >   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_pkey;
       public            postgres    false    218            �           2606    23891 "   bitacora bitacora_uid_empresa_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.bitacora
    ADD CONSTRAINT bitacora_uid_empresa_fkey FOREIGN KEY (uid_empresa) REFERENCES public.empresa(uid);
 L   ALTER TABLE ONLY public.bitacora DROP CONSTRAINT bitacora_uid_empresa_fkey;
       public          postgres    false    221    3205    216            �           2606    23876 "   bitacora bitacora_uid_usuario_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.bitacora
    ADD CONSTRAINT bitacora_uid_usuario_fkey FOREIGN KEY (uid_usuario) REFERENCES public.usuario(uid);
 L   ALTER TABLE ONLY public.bitacora DROP CONSTRAINT bitacora_uid_usuario_fkey;
       public          postgres    false    221    218    3209            �           2606    23849 !   chat chat_uid_usuario_emisor_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_uid_usuario_emisor_fkey FOREIGN KEY (uid_usuario_emisor) REFERENCES public.usuario(uid);
 K   ALTER TABLE ONLY public.chat DROP CONSTRAINT chat_uid_usuario_emisor_fkey;
       public          postgres    false    3209    218    219            �           2606    23854 #   chat chat_uid_usuario_receptor_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_uid_usuario_receptor_fkey FOREIGN KEY (uid_usuario_receptor) REFERENCES public.usuario(uid);
 M   ALTER TABLE ONLY public.chat DROP CONSTRAINT chat_uid_usuario_receptor_fkey;
       public          postgres    false    219    3209    218            �           2606    23866    messages messages_uid_chat_fkey    FK CONSTRAINT        ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_uid_chat_fkey FOREIGN KEY (uid_chat) REFERENCES public.chat(uid);
 I   ALTER TABLE ONLY public.messages DROP CONSTRAINT messages_uid_chat_fkey;
       public          postgres    false    219    220    3211            �           2606    23809 (   suscripcion suscripcion_uid_empresa_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.suscripcion
    ADD CONSTRAINT suscripcion_uid_empresa_fkey FOREIGN KEY (uid_empresa) REFERENCES public.empresa(uid);
 R   ALTER TABLE ONLY public.suscripcion DROP CONSTRAINT suscripcion_uid_empresa_fkey;
       public          postgres    false    217    3205    216            �           2606    23804 1   suscripcion suscripcion_uid_plan_suscripcion_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.suscripcion
    ADD CONSTRAINT suscripcion_uid_plan_suscripcion_fkey FOREIGN KEY (uid_plan_suscripcion) REFERENCES public.plan_suscripcion(uid);
 [   ALTER TABLE ONLY public.suscripcion DROP CONSTRAINT suscripcion_uid_plan_suscripcion_fkey;
       public          postgres    false    3203    217    215            �           2606    23829 !   usuario usuario_uid_contacto_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_uid_contacto_fkey FOREIGN KEY (uid_contacto) REFERENCES public.usuario(uid);
 K   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_uid_contacto_fkey;
       public          postgres    false    3209    218    218            �           2606    23819     usuario usuario_uid_empresa_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_uid_empresa_fkey FOREIGN KEY (uid_empresa) REFERENCES public.empresa(uid);
 J   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_uid_empresa_fkey;
       public          postgres    false    216    218    3205            �           2606    23824 $   usuario usuario_uid_lenguas_iso_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_uid_lenguas_iso_fkey FOREIGN KEY (uid_lenguas_iso) REFERENCES public.lenguas_iso(uid);
 N   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_uid_lenguas_iso_fkey;
       public          postgres    false    214    3201    218            /      x������ � �      -   *  x���1n1E띻����%�p��_��g�l�d��fD�`T+�Z��v[GS~y,j�JQ[�O���~*d�c����z�o�;Bm��3L!k8E�uޯ�����i�ǹA"\��Tǘ$E�G�G��\Ml-���� t�6� �L���t�����w@�"�����0�2�w^D�Z�A�?J[��%<�'��ݷ��a^�@����x�����4�ZD��g�"U��o�L���Pw��}Z��y���sͳ�]6K���^���0�-�ü�����qNHv���84c�O������"�w      *   %  x���=s�0 ��9�
W�|�a+X{��ד�g�%!�I��ǯow������N��@��#(��P�I�!�
⚂4;���� o^����_����`Vh����|[�5�%T���2x�2Z�q��D�r}��Y�ހd��-ܤ�{U1�ݵ�� 7��n��V-aF
N; �*�ܯ��""T,<C�	�S����W���5��҆�Ϊ��g��uxlӮKScsuoE���X=.��t7��i�N>�o��r񡏞�9Ӗ���>��v���U���C�s�����w�      (   �  x��M�1���]��og��A!Ē��83EU��{í8ý)��˫���B�e��,P$)p�Ie�HR��i�����Q���&H������[�u��M��������W_pd�j��ͿQ�� �U"�4��>�>����ϋ�:�R�`nJe��ÂPhI�9��>^�yq/�t���BO+@)2�00D]q⢺H�ۓE���L������ OFTJ�j�:8���y�?�-��f/Ro�"P�O���6���8fE���z���WKD3$�f/F-	�깷��PrNއ��ӷ1��U��2`�-�����M���5��4�L�ɥ�m�Z��5x�r��z�f��}EBs�}��%ÞiAցČq����q���g�����ej��~���q�Xd��o�w��f�k�d�%$��:�F�Z��:�wǩ���w�
+=v��qi��XV��m��u�;��Y���%XQ)�:r��}Q=7;�o������      .   �  x��X�j$�}.}E~�R��2/���ח���%23R�3�*��Z��3f�`�l��X��1���ZiA�Ն���]�y2�r���de�MIg}���"��9i�U�}�z^�{����M�0���t�uY?o�x?o�o���\+e����N�(s�Yr���V��4(۵��K�B���.�w#]1����6|x?�<,�Q�I��փ���r�*��}�`�;{J2���ó��R�IH+��K�"�g�Ȃg�x'��E���i .J^7�Jjҕ�%�`�.���v!��,��t�EY��c�z`۟#v���y@첳�¥V��Z���� �aGW-"��?����=��~[7��΋��n��J������u�B�gc4S�ρ�|�d�)b�b�),7|C��t)��eq�@�P�n��&~�?~>���w�W��OԂole	������$�H���m���A�wJ��G�}l�%�b��ɠIQ���S.�T���ůi3^�Я�e�x;����d{����q�Q̷{�Ϛ����'')�Y�(��N��U�*��Z�6�>̴;,�N7 �"�%qG���ka��s]���ȸ���]f4^]�J���sr<��0_�y�;�gpe^����>\�� ��!XF�����'�R-`ZYu���\7ǿ�e{����O�z��k�F�C2(�)xk*���۵�����X?�����xO�)����q���_��O�gݡ�\�W,���l��|�]�\�.�7ӎ.�����o&hq9~7�\�A��b�w�fAb�p}�<5��^R"�B�6��8�:��e*Y�֖�W� �� ������/)/��k�m�$K'Ĕ.�A��aX�=��Ӎ���Z�W�#q;5�Ap7Tv�?gm|nnU�M��;���e��H�Ԙ���M���bS=�R�Ο�'F�4gWR[�Q0��6|뼯)q�_��۵�X�%p���v�?H|�~�n^�o����u(�"'���o��\��u�F�Y�<���%�/Q0@��gߞ��nk7�$�k�t�=c�Ⱥ�a�2���h~۪�R�yj����jY��ц}����꣱6��(�{�����	ݩ��@2��Oz���J��%�l{xDw�GO3������0�u?(O�@�؊b�����-��Br%/��G�7��۵Y�/AM��@_��t*���&	�$3��5����u���e*����L����+�9uQE�&X�l� ���Ca�#Uԁ��3)<���\�% \�F�س6�B\?��(�R#Ue���Rw2;ؙ�UV�G0O�=���"z��#"�b�02�����<[�8<�1���?�:���J���#�����n���XeV�a[���������m�ϖ4W�F�f��k"Wd��`ڨF�8�f3��`����Mk3��
H�=�ۼ;~��6Z ���o�����6h�I*�.��$k�d���<$v��\�s�����������ſ Q�5      )   �   x���=N�0Dk���"��v	�@� 4��Z��/Fqr0���0$}�m��f\��2L�<���R(����RQ|,y�/��X�3"�*��+�&�~G;�6��n�X僛�B�wnC�!�![�1@̤��1�F:��u�[z������`��*:�QA��BD�s�OI{wz��z<n-Z��*����4�� 5a�i�>,ɪ2M~�j��;o��~�}㳌��|>����~$      +   �   x����1��^� B��������|����zv�� [�h�i!��A�I���\�܀��a��&Ɓ c6�`�ª�cM�r�N�2�,4MXf']��&�<�7R�5h�DR��h�fۋ"�%2��;f��CΡZ�x�?c�~���F�b�      ,   C  x��T�r�8];_������4�!��G�����)=���A��%陚z5U��=*Y>��s�0�&%`���b �J���Q�aHGˬص���YU���2W�66�<����,������8�,^�k�܍�+xL'�2y�^����xl��ujp�1�������|�H<"�1 !7����=T�T*�%e6�cf[���}��9�LaU��aX���$�Vi�8��2��Çr��O��N��즸���'��ڿM�"�-�¦��J�Z� S��D"i#ϱ
����j�Ʃ�K"9N�	��3G�4�	��b3*H@,M�P�;��e��+j�"��׍�*�aj��_�p~�O�vi����~��N������2Y�s�?��h��E���W�%I��lw��
U���M�9WK�M�\-]�췻 �(��S%L�R��Ի��L%k-mϴ��]��'�<���~������a��w	�
��H�4�s�<�
��A�pF
@����	��������e涭n�.�ke����Xɗy2��x:^��k'��s�T�����~y[dv,�����-5�J�gڇ1#����)j-�V��13�mU��Ψ(�פzi)�uE�?'�ǡ��;�os}����d��;}��ϧ��8��_�B
)�4���=/L�V�Xq��^x%�y�
=�5�D��a�|(�0�-�f����f��S��'iy�&a�M�	*��;?�������a��a-�z��T���O�JYά#@sD,BK�O�AZFl4�fGW��jUD����������gB���p����}��υa����2�5o��Ӿs~��d0��5{0,��g�gj��/����t\�Lq������Oa�u���4D]1R�8�,�ֱO]�UP─���)t�� x�u���ݭ3���#����iFb�o:���x��N�p0���&O�����>�S���k����}ݽ�T	�$��A��Bł����@(4�?x
!�me��Z� �$x�+���l�R6ϊ�:�׬/�r?Y|],zl�Lƛ����M��~Q���v�������<t�=����s�_������/�     